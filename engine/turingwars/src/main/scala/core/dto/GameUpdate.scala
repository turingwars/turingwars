package core.dto

case class GameUpdate(processes: List[Process], memory: List[MemoryUpdate], score: List[Score])

case class Process(processId: String, instructionPointer: Int, isAlive: Boolean)

case class MemoryUpdate(address: Int, cause: Int, value: Instruction)

case class Score(playerId: String, score: Int)

// TODO: Better definition for instruction. Maybe share with core
case class Instruction(op: String, a: InstructionField, b: InstructionField)

case class InstructionField(fieldType: String, value: Int, field: String)
