package helpers

import core.instructions._
import io.circe.generic.auto._
import io.circe.parser._

object ProgramDeserializer {

  case class Field(fieldType: String, value: Int, field: String) {
    def toFieldValue(): FieldValue = {
      if(fieldType == "reference") {
        val t = if(field == "a") FieldType.a else FieldType.b
        ReferenceValue(value, t)
      } else ImmediateValue(value)
    }
  }
  case class Instr(op: String, a: Field, b: Field) {

    def toInstruction(): Instruction = {
      val aField = a.toFieldValue()
      val bField = b.toFieldValue()
      op.toLowerCase() match {
        case "add" => Add(aField, bField)
        case "sub" => Sub(aField, bField)
        case "subb" => Subb(aField, bField)
        case "mul" => Mul(aField, bField)
        case "div" => Div(aField, bField)
        case "divb" => Divb(aField, bField)
        case "mod" => Mod(aField, bField)
        case "modb" => Modb(aField, bField)
        case "mov" => Mov(aField, bField)
        case "jmp" => Jmp(aField, bField)
        case "jz" => Jz(aField, bField)
        case "jnz" => Jnz(aField, bField)
        case "se" => Se(aField, bField)
        case "sne" => Sne(aField, bField)
        case "nop" => Nop()
        case "mine" => Mine(aField, bField)
        case "dat" => Dat(aField, bField)
      }
    }
  }
  case class Program(program: List[Instr])

  def deserialize(json: String): List[Instruction] = {
    val program = decode[Program](json) match {
      case Right(value) => value.program
      case Left(error) => throw error
    }
    program.map(_.toInstruction())
  }

}



