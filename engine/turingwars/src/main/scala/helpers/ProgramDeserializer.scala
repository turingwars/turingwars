package helpers

import com.google.gson.Gson
import core.instructions._

import scala.collection.JavaConverters._


object ProgramDeserializer {

  def main(args: Array[String]): Unit = {
    //val json = "{\"program\":[{\"op\":\"ADD\",\"a\":{\"fieldType\":\"reference\",\"value\":1,\"field\":\"a\"},\"b\":{\"fieldType\":\"immediate\",\"value\":4,\"field\":\"a\"}},{\"op\":\"JMP\",\"a\":{\"fieldType\":\"immediate\",\"value\":1,\"field\":\"a\"},\"b\":{\"fieldType\":\"immediate\",\"value\":0,\"field\":\"a\"}},{\"op\":\"NOP\",\"a\":{\"fieldType\":\"immediate\",\"value\":0,\"field\":\"a\"},\"b\":{\"fieldType\":\"immediate\",\"value\":0,\"field\":\"a\"}}]}"
    val json = "{\n  \"program\": [\n    {\n      \"type\": \"MOV\",\n      \"aField\": {\n        \"fieldType\": \"immediate\",\n        \"value\": 1,\n        \"field\": \"a\"\n      },\n      \"bField\": {\n        \"fieldType\": \"immediate\",\n        \"value\": 0,\n        \"field\": \"a\"\n      }\n    }\n  ]\n}";
    val program = deserialize(json)
    println(program)
  }


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
      val aField = a.toFieldValue
      val bField = b.toFieldValue
      op toLowerCase match {
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
  class Program {
    var program: java.util.ArrayList[Instr] = new java.util.ArrayList[Instr]
    def setProgram(pro: java.util.ArrayList[Instr]) = program = pro
  }

  def deserialize(json: String): List[Instruction] = {
    val program = new Gson().fromJson(json, classOf[Program]).program
    val programList: Iterable[Instr] = program.asScala
    programList.map(_.toInstruction).toList
  }


}



