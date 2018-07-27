package core

import helpers.ProgramDeserializer
import io.scalajs.nodejs.fs._
import io.scalajs.nodejs.process

object Application {

  /*
  args:
  first program
  second program
  number of cycles between each mem diff
  number of cycles to play
  size of the core
   */
  def main(args: Array[String]): Unit = {

    val prog1 = ProgramDeserializer.deserialize(
      Fs.readFileSync(process.argv(2)).toString("utf-8")
    )
    val prog2 = ProgramDeserializer.deserialize(
      Fs.readFileSync(process.argv(3)).toString("utf-8")
    )

    val diffFrequency = process.argv(4).toInt

    val nbCycles = process.argv(5).toInt

    val memorySize = process.argv(6).toInt
    val memory = new Memory(memorySize)

    val eip1 = 0
    val eip2 = memorySize/2

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

    val ALU = new ExecutionUnit(state, nbCycles, diffFrequency)

    ALU.run()
  }

}
