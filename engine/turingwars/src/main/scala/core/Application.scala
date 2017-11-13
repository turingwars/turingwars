package core

import helpers.ProgramDeserializer

import scala.io.Source

object Application {

  /*
  args:
  first program
  second program
  number of cycles between each mem diff
  number of cycles to play
   */
  def main(args: Array[String]): Unit = {
    val prog1 = ProgramDeserializer.deserialize(
      Source.fromFile(args(0)).getLines().toList.mkString(" ")
    )
    val prog2 = ProgramDeserializer.deserialize(
      Source.fromFile(args(1)).getLines().toList.mkString(" ")
    )



    val diffFrequency = args(2).toInt

    val nbCycles = args(3).toInt

    val memorySize = args(4).toInt
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
