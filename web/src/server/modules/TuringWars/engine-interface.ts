import * as rt from "runtypes";
import { GameUpdate } from 'shared/model/GameUpdate';

export const Outcome = rt.Record({
    winner: rt.Number,
    score1: rt.Number,
    score2: rt.Number
});

export const SimulationResult = rt.Record({
    outcome: Outcome,
    frames: rt.Array(GameUpdate)
});
