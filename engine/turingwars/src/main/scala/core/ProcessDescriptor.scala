package core

class ProcessDescriptor(var eip: Int, val pid: Int, var isAlive: Boolean = true) {
  def kill(): Unit = {
    isAlive = false
  }
}
