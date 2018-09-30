package core

import core.instructions._

class Memory(val size: Int) {
  private val memory: Array[(Instruction, Int)] = Array.fill(size)(Nop(), -1)
  var diff: List[Diff] = List()

  case class DiffFieldValue(fieldType: String, value: Int, field: String)
  case class DiffValue(instructionType: String, aField: DiffFieldValue, bField: DiffFieldValue)
  case class Diff(address: Int, cause: Int, value: DiffValue)

  def getRelative(process: ProcessDescriptor, offset: Int): (Instruction, Int) = {
    val mod = (process.eip + offset) % size
    val newIndex =
      if(mod >= 0) mod else size + mod

    memory(newIndex)
  }

  def setRelative(process: ProcessDescriptor, offset: Int, instruction: Instruction, cause: Int): Unit = {
    val mod = (process.eip + offset) % size
    val newIndex =
      if(mod >= 0) mod else size + mod

    memory.update(newIndex, (instruction, cause))


    diff = diff :+ Diff(
      newIndex,
      cause,
      DiffValue(
        instructionToOpcode(instruction),
        DiffFieldValue(
          instruction.a match { case ImmediateValue(v) => "immediate"; case _ => "reference"},
          instruction.a.value,
          instruction.a match {
            case ImmediateValue(_) => "a"
            case ReferenceValue(_, t) => if(t == FieldType.a) "a" else "b"
          }
        ),
        DiffFieldValue(
          instruction.b match { case ImmediateValue(v) => "immediate"; case _ => "reference"},
          instruction.b.value,
          instruction.b match {
            case ImmediateValue(_) => "a"
            case ReferenceValue(_, t) => if(t == FieldType.a) "a" else "b"
          }
        )
      )
    )
  }

  def instructionToOpcode(instruction: Instruction): String = instruction match {
    case Add(_, _) => "ADD"
    case Nop(_, _) => "NOP"
    case Sub(_, _) => "SUB"
    case Subb(_, _) => "SUBB"
    case Mul(_, _) => "MUL"
    case Div(_, _) => "DIV"
    case Divb(_, _) => "DIVB"
    case Mod(_, _) => "MOD"
    case Modb(_, _) => "MODB"
    case Jmp(_, _) => "JMP"
    case Jz(_, _) => "JZ"
    case Jnz(_, _) => "JNZ"
    case Mov(_, _) => "MOV"
    case Se(_, _) => "SE"
    case Sne(_, _) => "SNE"
    case Mine(_, _) => "MINE"
    case Dat(_, _) => "DAT"
    case _ => throw new IllegalStateException("plz implement")
  }


  def resetDiff(): Unit = {
    diff = Nil
  }
}
