package core.dto

case class Outcome(winner: Int, score1: Int, score2: Int)
case class SimulationResult(outcome: Outcome, frames: List[GameUpdate])
