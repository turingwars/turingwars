
package core

import core.dto._
import helpers.ProgramDeserializer
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._

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
    val log = (0 until config.nbCycles)
      .map(_ => {
        val s = ALU.serializedState()
        ALU.step()
        s
      })
      .takeWhile(s => !s.score.exists(_.score >= 1000))
      .grouped(config.diffFrequency)
      .map(s => GameUpdate(s.last.processes, s.flatMap(_.memory).toList, s.last.score))
      .toList
    SimulationResult(score2Outcome(log.last.score), log).asJson.noSpaces
  }

  private def score2Outcome(score: List[Score]) = {
    val score1 = score(0).score
    val score2 = score(1).score
    if (score1 > score2) {
      Outcome(0, score1, score2)
    } else if (score1 < score2) {
      Outcome(1, score1, score2)
    } else {
      Outcome(-1, score1, score2)
    }
  }
}
