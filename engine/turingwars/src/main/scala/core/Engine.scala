
package core

import core.dto.EngineConfiguration
import helpers.ProgramDeserializer
import io.circe.generic.auto._
import io.circe.parser._

import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

@JSExportTopLevel("Engine")
class Engine(val prog1Code: String, val prog2Code: String, val configJSON: String) {

  private val config = decode[EngineConfiguration](configJSON) match {
    case Right(value) => value
    case Left(error) => throw error
  }

  private val memory = new Memory(config.memorySize)

  private val prog1 = ProgramDeserializer.deserialize(prog1Code)
  private val prog2 = ProgramDeserializer.deserialize(prog2Code)

  private val ALU = {
    val eip1 = 0
    val eip2 = config.memorySize/2

    val pid1 = 0
    val pid2 = 1

    val pd = List(new ProcessDescriptor(eip1, 0), new ProcessDescriptor(eip2, 1))

    for (i <- eip1 until eip1 + prog1.size) {
      memory.setRelative(pd.head, i - eip1, prog1(i - eip1), pid1)
    }

    for (j <- eip2 until eip2 + prog2.size) {
      memory.setRelative(pd(1), j - eip2, prog2(j - eip2), pid2)
    }


    val state = new State(memory, pd, Map(0 -> 0, 1 -> 0))

    new ExecutionUnit(state, config.nbCycles, config.diffFrequency)
  }

  @JSExport
  def run(): String = {
    var result = "["
    for (i <- 0 until config.nbCycles) {
      if((i % config.diffFrequency) == 0) {
        result += ALU.outputState() + ","
      }
      ALU.step()
    }
    result.substring(0, result.length - 1) + "]"
  }
}
