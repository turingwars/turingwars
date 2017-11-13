package core.instructions

/** NOP **/
object Nop {
  def apply(): Nop = Nop(ImmediateValue(0), ImmediateValue(0))
}

case class Nop(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Nop()
}

case class Add(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Add(newA, newB)
}

case class Sub(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Sub(newA, newB)
}

case class Subb(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Subb(newA, newB)
}

case class Mul(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Mul(newA, newB)
}

case class Div(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Div(newA, newB)
}

case class Divb(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Divb(newA, newB)
}

case class Mod(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Mod(newA, newB)
}

case class Modb(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Modb(newA, newB)
}

case class Jmp(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Jmp(newA, newB)
}

case class Jz(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Jz(newA, newB)
}

case class Jnz(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue) = Jnz(newA, newB)
}

case class Mov(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue): Instruction = Mov(newA, newB)
}

case class Se(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue): Instruction = Se(newA, newB)
}

case class Sne(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue): Instruction = Sne(newA, newB)
}

case class Mine(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue): Instruction = Mine(newA, newB)
}

case class Dat(a: FieldValue, b: FieldValue) extends Instruction {
  override def copy(newA: FieldValue, newB: FieldValue): Instruction = Dat(newA, newB)
}