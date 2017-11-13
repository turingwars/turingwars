import core._
import core.instructions._
import org.scalatest._

class InstructionsSpec extends FlatSpec with Matchers {

  "Memory" should "add stuff" in {
    val add1 = Add(ReferenceValue(0, FieldType.a), ImmediateValue(1))
    val memory = new Memory(1)
    memory.setRelative(new ProcessDescriptor(0, 0), 0, add1, 1)
    memory.getRelative(new ProcessDescriptor(0, 0), 0)._1 should be (add1)
  }

  it should "allow retrieving negative indexes" in {
    val memory = new Memory(10)
    val instruction = Add(ReferenceValue(0, FieldType.a), ImmediateValue(1))
    memory.setRelative(new ProcessDescriptor(9, 0), 0, instruction, 1)
    memory.getRelative(new ProcessDescriptor(-1, 0), 0)._1 should be (instruction)
    memory.getRelative(new ProcessDescriptor(-11, 0), 0)._1 should be (instruction)
  }

  "instruction.copy" should "copy an instruction" in {
    val add1 = Add(ReferenceValue(0, FieldType.a), ImmediateValue(1))
    add1.copy(add1.a, add1.b) should be (add1)
  }

  "an add" should "add values" in {
    val add1 = Add(ReferenceValue(0, FieldType.a), ImmediateValue(1))
    val add2 = Add(ReferenceValue(1, FieldType.a), ImmediateValue(1))
    run(List(add1, add2)).getRelative(new ProcessDescriptor(0, 0), 0)._1 should equal (add2)
  }

  "an add" should "add values again" in {
    val add1 = Add(ReferenceValue(1, FieldType.a), ReferenceValue(1, FieldType.b))
    val add2 = Add(ReferenceValue(2, FieldType.a), ImmediateValue(3))
    val add3 = Add(ReferenceValue(5, FieldType.a), ImmediateValue(3))
    run(List(add1, add2, add3)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should equal (add3)

  }

  "an add" should "still add values" in {
    val add1 = Add(ReferenceValue(0, FieldType.b), ImmediateValue(40))
    val add2 = Add(ReferenceValue(0, FieldType.b), ImmediateValue(80))
    run(List(add1, add2)).getRelative(new ProcessDescriptor(0, 0), 0)._1 should equal (add2)

  }

  "a sub" should "sub values" in {
    val sub1 = Sub(ReferenceValue(1, FieldType.a), ImmediateValue(4))
    val add1 = Add(ReferenceValue(1, FieldType.a), ImmediateValue(2))
    val res = Add(ReferenceValue(-3, FieldType.a), ImmediateValue(2))
    run(List(sub1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)
  }

  "a subb" should "subb values" in {
    val sub1 = Subb(ImmediateValue(4), ReferenceValue(1, FieldType.b))
    val add1 = Add(ReferenceValue(1, FieldType.b), ImmediateValue(42))
    val res = Add(ReferenceValue(1, FieldType.b), ImmediateValue(-38))
    run(List(sub1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)
  }

  "a mul" should "mul values" in {
    val mul1 = Mul(ReferenceValue(1, FieldType.a), ImmediateValue(3))
    val add1 = Add(ReferenceValue(2, FieldType.a), ImmediateValue(1))
    val res = Add(ReferenceValue(6, FieldType.a), ImmediateValue(1))
    run(List(mul1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)

  }

  "a div" should "div values" in {
    val div1 = Div(ReferenceValue(1, FieldType.a), ImmediateValue(3))
    val add1 = Add(ReferenceValue(4, FieldType.a), ImmediateValue(1))
    val res = Add(ReferenceValue(1, FieldType.a), ImmediateValue(1))
    run(List(div1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)

  }

  "a divb" should "divb values" in {
    val divb1 = Divb(ImmediateValue(6), ReferenceValue(1, FieldType.a))
    val add1 = Add(ReferenceValue(2, FieldType.a), ImmediateValue(1))
    val res = Add(ImmediateValue(3), ImmediateValue(1))
    run(List(divb1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)

  }

  "a mod" should "mod values" in {
    val mod1 = Mod(ReferenceValue(1, FieldType.a), ImmediateValue(3))
    val add1 = Add(ReferenceValue(4, FieldType.a), ImmediateValue(1))
    val res = Add(ReferenceValue(1, FieldType.a), ImmediateValue(1))
    run(List(mod1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)

  }

  "a modb" should "modb values" in {
    val modb1 = Modb(ImmediateValue(6), ReferenceValue(1, FieldType.a))
    val add1 = Add(ReferenceValue(2, FieldType.a), ImmediateValue(1))
    val res = Add(ImmediateValue(0), ImmediateValue(1))
    run(List(modb1, add1)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (res)

  }

  "a mov" should "move values" in {
    val mov = Mov(ImmediateValue(1), ImmediateValue(2))
    val add1 = Add(ReferenceValue(2, FieldType.a), ImmediateValue(1))
    val add2 = Add(ReferenceValue(42, FieldType.b), ImmediateValue(42))

    run(List(mov, add1, add2)).getRelative(new ProcessDescriptor(1, 0), 0)._1 should be (add2)
  }



  def run(is: List[Instruction]) = {
    val memory = new Memory(is.size)
    for(i <- is.indices) {
      memory.setRelative(new ProcessDescriptor(i, i), 0, is(i), 1)
    }
    val descriptor = new ProcessDescriptor(0, 0)
    val initialState = State(memory, List(descriptor), Map())
    new ExecutionUnit(initialState).execute(descriptor)
    memory
  }



}