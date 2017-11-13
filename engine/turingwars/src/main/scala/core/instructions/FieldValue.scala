package core.instructions


object FieldType extends Enumeration {
  type Type = Value
  val a, b = Value
}

abstract class FieldValue(val value: Int) {
  def +(other: FieldValue): FieldValue
  def -(other: FieldValue): FieldValue
  def *(other: FieldValue): FieldValue
  def /(other: FieldValue): FieldValue
  def %(other: FieldValue): FieldValue
}

case class ImmediateValue(override val value: Int) extends FieldValue(value) {
  override def +(other: FieldValue) = ImmediateValue(value + other.value)
  override def -(other: FieldValue) = ImmediateValue(value - other.value)
  override def *(other: FieldValue) = ImmediateValue(value * other.value)
  override def /(other: FieldValue) = ImmediateValue(value / other.value)
  override def %(other: FieldValue) = ImmediateValue(value % other.value)
}

case class ReferenceValue(override val value: Int, targetField: FieldType.Type) extends FieldValue(value) {
  override def +(other: FieldValue) = ReferenceValue(value + other.value, targetField)
  override def -(other: FieldValue) = ReferenceValue(value - other.value, targetField)
  override def *(other: FieldValue) = ReferenceValue(value * other.value, targetField)
  override def /(other: FieldValue) = ReferenceValue(value / other.value, targetField)
  override def %(other: FieldValue) = ReferenceValue(value % other.value, targetField)

}
