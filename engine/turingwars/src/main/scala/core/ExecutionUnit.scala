package core

import io.circe._, io.circe.generic.auto._, io.circe.parser._, io.circe.syntax._
import core.dto.{Instruction => InstructionDTO, _}
import core.instructions._

// main execution class
class ExecutionUnit(var state: State, val nbCycles: Int = 1000, val diffFrequency: Int = 1) {

  def run(): Unit = {
    for (i <- 0 until nbCycles) {
      if((i % diffFrequency) == 0) {
        println(outputState())
        state.memory.resetDiff()
      }

      state.processes.foreach(process => {
        if (process.isAlive) {
          process.eip = execute(process)
          // Round off to keep process inside the core
          val mod = process.eip % state.memory.size
          process.eip = if (mod >= 0) mod else mod + state.memory.size
        }
      })
    }
  }

  // executes the next instruction for the eid in the process
  def execute(process: ProcessDescriptor): Int = {
    val memoryLocation = state.memory.getRelative(process, 0)
    memoryLocation._1 match {
      case add: Add => binaryOperatorExecutor(add, process, state.memory, _ + _, memoryLocation._2); process.eip + 1
      case sub: Sub => binaryOperatorExecutor(sub, process, state.memory, _ - _, memoryLocation._2); process.eip + 1
      case subb: Subb => reverseBinaryOperatorExecutor(subb, process, state.memory, (a, b) => b - a, memoryLocation._2); process.eip + 1
      case mul: Mul => binaryOperatorExecutor(mul, process, state.memory, _ * _, memoryLocation._2); process.eip + 1
      case div: Div => binaryOperatorExecutor(div, process, state.memory, _ / _, memoryLocation._2); process.eip + 1
      case divb: Divb => reverseBinaryOperatorExecutor(divb, process, state.memory, (a, b) => b / a, memoryLocation._2); process.eip + 1
      case mod: Mod => binaryOperatorExecutor(mod, process, state.memory, _ % _, memoryLocation._2); process.eip + 1
      case modb: Modb => reverseBinaryOperatorExecutor(modb, process, state.memory,(a, b) => b % a, memoryLocation._2); process.eip + 1

      case Mov(dest, source) => {
        val sourceValue = resolve(source, process, state.memory).value // don't care whether immediate or reference
        val destValue = resolve(dest, process, state.memory).value
        state.memory.setRelative(process, destValue, state.memory.getRelative(process, sourceValue)._1, memoryLocation._2)
      }; process.eip + 1

      case _: Nop => process.eip + 1

      case Jmp(a, _) => process.eip + resolve(a, process, state.memory).value

      case Jz(a, b) => {
        val testValue = resolve(b, process, state.memory).value
        if (testValue == 0) process.eip + resolve(a, process, state.memory).value
        else process.eip + 1
      }
      case Jnz(a, b) => {
        val testValue = resolve(b, process, state.memory).value
        if (testValue != 0) process.eip + resolve(a, process, state.memory).value
        else process.eip + 1
      }
      // SE A B => Skips next instruction if instructions at A and B are equal
      case Se(a, b) => {
        val instructionA = state.memory.getRelative(process, resolve(a, process, state.memory).value)
        val instructionB = state.memory.getRelative(process, resolve(b, process, state.memory).value)
        process.eip + 1 + (if(instructionA == instructionB) 1 else 0)
      }
      case Sne(a, b) => {
        val instructionA = state.memory.getRelative(process, resolve(a, process, state.memory).value)
        val instructionB = state.memory.getRelative(process, resolve(b, process, state.memory).value)
        process.eip + 1 + (if(instructionA != instructionB) 1 else 0)
      }

      case Mine(playerId, _) => playerId match {
        case ImmediateValue(playerIdInt) => {
          val currentScore = state.scores.getOrElse(playerIdInt, 0)
          state = State(state.memory, state.processes, state.scores.updated(playerIdInt, 1 + currentScore))
        }
        case _ => process.kill()

      }; process.eip + 1

      case _: Dat => process.kill(); process.eip + 1
    }
  }

  def binaryOperatorExecutor(instruction: Instruction, process: ProcessDescriptor, memory: Memory, f: (FieldValue, FieldValue) => FieldValue, cause: Int) = {
    instruction.a match {
      case ImmediateValue(v) => process.kill()
      case ReferenceValue(relativeAddress, destType) => {
        val operand = resolve(instruction.b, process, memory)
        val destInstruction = memory.getRelative(process, relativeAddress)._1
        memory.setRelative(process, relativeAddress, applyWithType(destInstruction, destType,  f(_, operand)), cause)
      }

    }
  }

  def reverseBinaryOperatorExecutor(instruction: Instruction, process: ProcessDescriptor, memory: Memory, f: (FieldValue, FieldValue) => FieldValue, cause: Int) = {
    instruction.b match {
      case ImmediateValue(v) => process.kill()
      case ReferenceValue(relativeAddress, destType) => {
        val operand = resolve(instruction.a, process, memory)
        val destInstruction = memory.getRelative(process, relativeAddress)._1
        memory.setRelative(process, relativeAddress, applyWithType(destInstruction, destType,  f(_, operand)), cause)
      }
    }
  }

  def resolve(fieldValue: FieldValue, process: ProcessDescriptor, memory:Memory): FieldValue = fieldValue match {
    case v:ImmediateValue => v
    case ReferenceValue(relativeAddress, destType) => {
      val target = memory.getRelative(process, relativeAddress)._1
      val targetValue = if(destType == FieldType.a) target.a else target.b
      targetValue
    }
  }

  def applyWithType(destInstruction: Instruction, destType: FieldType.Type, f: FieldValue => FieldValue): Instruction = {
    val (newA, newB) =
      if (destType == FieldType.a) ( f(destInstruction.a), destInstruction.b)
      else (destInstruction.a, f(destInstruction.b))

    destInstruction.copy(newA, newB)
  }

  def outputState(): String = {
    GameUpdate(
      state.processes.zipWithIndex.map({ case (descriptor: ProcessDescriptor, id: Int) =>
        Process(
          id.toString, descriptor.eip, descriptor.isAlive
        )
      }),
      state.memory.diff.map(diff => MemoryUpdate(
        diff.address,
        diff.cause,
        InstructionDTO(
          diff.value.instructionType,
          InstructionField(
            diff.value.aField.fieldType,
            diff.value.aField.value,
            diff.value.aField.field
          ),
          InstructionField(
            diff.value.bField.fieldType,
            diff.value.bField.value,
            diff.value.bField.field
          )
        )
      )),
      state.scores.map(t => Score(t._1.toString, t._2)).toList
    ).asJson.noSpaces
  }
}
