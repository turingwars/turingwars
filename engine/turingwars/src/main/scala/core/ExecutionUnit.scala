package core

import core.instructions._

// main execution class
class ExecutionUnit(var state: State, val nbCycles: Int = 1000, val diffFrequency: Int = 1) {


  def run(): Unit = {
    for (i <- 0 until nbCycles) {
      if((i % diffFrequency) == 0) {
        print(outputState())
        state.memory.resetDiff()
      }

      state.processes.foreach(process => {
        if (process.isAlive) {
          process.eip = execute(process)
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
    var str: String = "{\"processes\": ["
    for (i <- 0 until state.processes.size) {
      val mod = state.processes(i).eip % state.memory.size
      val wrappedEip = if (mod >= 0) mod else mod + state.memory.size
      str += "{\"processId\": " + i + ", \"instructionPointer\": " + wrappedEip + ", \"isAlive\": " + state.processes(i).isAlive + "}"
      if (i < state.processes.size - 1) {
        str += ","
      }
    }
    str += "], "
    str += "\"memory\": ["
    for (diff <- state.memory.diff) {
      str += "{ \"address\": " + diff.address + ","
      str += "\"cause\": " + diff.cause + ","
      str += "\"value\": {"
      str += "\"op\": \"" + diff.value.instructionType + "\","
      str += "\"a\": {"
      str += "\"fieldType\": \"" + diff.value.aField.fieldType + "\","
      str += "\"value\": " + diff.value.aField.value + ","
      str +=  "\"field\": \"" + diff.value.aField.field + "\""
      str += "},"
      str += "\"b\": {"
      str += "\"fieldType\": \"" + diff.value.bField.fieldType + "\","
      str += "\"value\": " + diff.value.bField.value + ","
      str += "\"field\": \"" + diff.value.bField.field + "\""
      str += "}"
      str += "}},"
    }
    if (state.memory.diff.size > 0) {
      str = str.dropRight(1)
    }
    str += "],"
    str += "\"score\": ["
    var i = 0
    for((playerId, score) <- state.scores) {
      str += "{\"playerId\": " + playerId + ", \"score\": \"" + score + "\"},"
      i += 1
    }
    if (!state.scores.isEmpty) {
      str = str.dropRight(1)
    }
    str += "]"
    str += "}"
    str += "\n"

    str
  }

}
