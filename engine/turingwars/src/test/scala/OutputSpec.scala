import core.{ExecutionUnit, Memory, ProcessDescriptor, State}
import core.instructions.{Add, _}
import org.scalatest._

class OutputSpec extends FlatSpec with Matchers {
  "the output" should "be correct" in {
    run(
      Nop() ::
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(2)) ::
      Add(ReferenceValue(1, FieldType.a), ImmediateValue(2)) ::
      Nil
    )
  }

  "a complex simulation" should "be correct with two programs" in {
    run(
      // Player 1
      Nop() ::
      Mine(ImmediateValue(0), ImmediateValue(0)) ::
      Add(ReferenceValue(5, FieldType.a), ImmediateValue(0)) ::
      Sub(ReferenceValue(-1, FieldType.a), ImmediateValue(1)) ::
      Jnz(ReferenceValue(-2, FieldType.a), ImmediateValue(-4)) ::
      Nop() ::
      Nop() ::
      Nop() :: Nop() :: Nop() :: Nop() :: Nop() ::
      // Player 2
      Add(ReferenceValue(0, FieldType.b), ImmediateValue(0)) ::
      Add(ReferenceValue(-1, FieldType.b), ImmediateValue(1)) ::
      Add(ReferenceValue(-2, FieldType.b), ImmediateValue(1)) ::
      Add(ReferenceValue(-3, FieldType.b), ImmediateValue(2)) ::
      Add(ReferenceValue(-4, FieldType.b), ImmediateValue(1)) ::
      Nop() :: Nop() :: Nop() :: Nop() :: Nop() ::
      Nil
    , List(
        new ProcessDescriptor(0, 0),
        new ProcessDescriptor(12, 1)
      ))
  }


  def run(is: List[Instruction]): Memory = {
    run(is, List(new ProcessDescriptor(0, 0)))
  }

  def run(is: List[Instruction], p: List[ProcessDescriptor]): Memory = {
    val memory = new Memory(is.size)
    for(i <- is.indices) {
      memory.setRelative(new ProcessDescriptor(i, 0), 0, is(i), 0)
    }
    val initialState = State(memory, p, Map())
    new ExecutionUnit(initialState).run()
    memory
  }
}
