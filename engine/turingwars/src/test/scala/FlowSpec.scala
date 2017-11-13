import core.instructions._

import core._
import org.scalatest.{FlatSpec, Matchers}

class FlowSpec extends FlatSpec with Matchers{

  val UNUSED = ImmediateValue(42)

  "Jmp" should "jump to a direct value" in {
    run(List(
      Jmp(ImmediateValue(1000), UNUSED)
    )) should be (1000)
  }

  it should "jump using a reference value" in {
    run(List(
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(42)),
      Jmp(ReferenceValue(-1, FieldType.b), UNUSED)
    ), 1) should be (43)
  }

  "Jz" should "jump with direct values" in {
    run(List(
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(0)),
      Jz(ImmediateValue(42), ReferenceValue(-1, FieldType.b))
    ), 1) should be (43)

    run(List(
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(1)),
      Jz(ImmediateValue(42), ReferenceValue(-1, FieldType.b))
    ), 1) should be (2)
  }

  it should "jump with reference values" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Jz(ReferenceValue(-1, FieldType.a), ReferenceValue(-1, FieldType.b))
    ), 1) should be (43)

    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(1)),
      Jz(ReferenceValue(-1, FieldType.a), ReferenceValue(-1, FieldType.b))
    ), 1) should be (2)
  }

  "Jnz" should "jump with direct values" in {
    run(List(
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(0)),
      Jnz(ImmediateValue(42), ReferenceValue(-1, FieldType.b))
    ), 1) should be (2)

    run(List(
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(1)),
      Jnz(ImmediateValue(42), ReferenceValue(-1, FieldType.b))
    ), 1) should be (43)
  }

  it should "jump with reference values" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Jnz(ReferenceValue(-1, FieldType.a), ReferenceValue(-1, FieldType.b))
    ), 1) should be (2)

    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(1)),
      Jnz(ReferenceValue(-1, FieldType.a), ReferenceValue(-1, FieldType.b))
    ), 1) should be (43)
  }

  "Se" should "skip when equals" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Se(ImmediateValue(-1), ImmediateValue(-2))
    ), 2) should be (4)
  }

  it should "skip when equals with references" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(-3)),
      Se(ReferenceValue(-1, FieldType.b), ImmediateValue(-2))
    ), 3) should be (5)

    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(-4, FieldType.a), ImmediateValue(-3)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(-3)),
      Se(ReferenceValue(-1, FieldType.b), ReferenceValue(-2, FieldType.a))
    ), 4) should be (6)
  }
  it should "not skip when not equals" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(43, FieldType.a), ImmediateValue(0)),
      Se(ImmediateValue(-1), ImmediateValue(-2))
    ), 2) should be (3)
  }

  "Sne" should "jump when not equals" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Sne(ImmediateValue(-1), ImmediateValue(-2))
    ), 2) should be (3)


  }

  it should "not jump when equals" in {
    run(List(
      Add(ReferenceValue(42, FieldType.a), ImmediateValue(0)),
      Add(ReferenceValue(43, FieldType.a), ImmediateValue(0)),
      Sne(ImmediateValue(-1), ImmediateValue(-2))
    ), 2) should be (4)
  }

  it should "work" in {
    val memory = new Memory(10)
    val fd = List(new ProcessDescriptor(1, 1), new ProcessDescriptor(6, 2))
    memory.setRelative(fd.head, 0, Mov(ImmediateValue(1), ImmediateValue(0)), 1)
    memory.setRelative(fd(1), 0, Mov(ImmediateValue(1), ImmediateValue(0)), 2)
    new ExecutionUnit(State(memory, fd, Map())).run()
  }

  it should "properly do christophe's program" in {
    val memory = new Memory(10)
    val pd = new ProcessDescriptor(0, 0)
    memory.setRelative(pd, 0, Jmp(ImmediateValue(2), ImmediateValue(0)), 0)
    memory.setRelative(pd, 1, Dat(ImmediateValue(0), ImmediateValue(0)), 0)
    memory.setRelative(pd, 2, Jz(ImmediateValue(2), ReferenceValue(-1, FieldType.a)), 0)
    memory.setRelative(pd, 3, Mine(ImmediateValue(0), ImmediateValue(0)), 0)
    new ExecutionUnit(State(memory, List(pd), Map(0 -> 0))).run()
  }

  it should "properly do christophe's other program" in {
    val memory = new Memory(10)
    val pd = new ProcessDescriptor(0, 0)
    memory.setRelative(pd, 0, Jmp(ImmediateValue(2), ImmediateValue(0)), 0)
    memory.setRelative(pd, 1, Dat(ImmediateValue(0), ImmediateValue(0)), 0)
    memory.setRelative(pd, 2, Jnz(ImmediateValue(2), ReferenceValue(-1, FieldType.a)), 0)
    memory.setRelative(pd, 3, Mine(ImmediateValue(0), ImmediateValue(0)), 0)
    new ExecutionUnit(State(memory, List(pd), Map(0 -> 0))).run()
  }

  it should "this one too" in {
    val memory = new Memory(10)
    val pd = new ProcessDescriptor(0, 0)
    memory.setRelative(pd, 0, Jmp(ImmediateValue(2), ImmediateValue(0)), 0)
    memory.setRelative(pd, 1, Dat(ImmediateValue(0), ImmediateValue(0)), 0)
    memory.setRelative(pd, 2, Jnz(ImmediateValue(2), ReferenceValue(-1, FieldType.a)), 0)
    memory.setRelative(pd, 3, Mine(ImmediateValue(0), ImmediateValue(0)), 0)
    memory.setRelative(pd, 4, Jmp(ImmediateValue(-2), ImmediateValue(0)), 0)
    new ExecutionUnit(State(memory, List(pd), Map(0 -> 0))).run()
  }

  def run(is: List[Instruction], eip: Int = 0) = {
    val memory = new Memory(is.size)
    val descriptor = new ProcessDescriptor(eip, 1)
    for(i <- is.indices) {
      memory.setRelative(new ProcessDescriptor(0, 0), i, is(i), 1)
    }

    val initialState = State(memory, List(descriptor), Map())
    new ExecutionUnit(initialState).execute(descriptor)
  }
}
