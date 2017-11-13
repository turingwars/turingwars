package core

case class State(memory: Memory, processes: List[ProcessDescriptor], scores: Map[Int, Int]) {
}
