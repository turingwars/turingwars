package core.instructions

trait Instruction {
  val a: FieldValue
  val b: FieldValue

  def copy(newA: FieldValue, newB: FieldValue): Instruction
}