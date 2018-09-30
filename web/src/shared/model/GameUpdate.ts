import { Instruction } from './Instruction';
import * as rt from 'runtypes';

export type Process = rt.Static<typeof Process>;
export const Process = rt.Record({
    processId: rt.String,
    instructionPointer: rt.Number,
    isAlive: rt.Boolean
});

export const MemoryUpdate = rt.Record({
    address: rt.Number,
    cause: rt.Number,
    value: Instruction
});

export const Score = rt.Record({
    playerId: rt.String,
    score: rt.Number
});

export type GameUpdate = rt.Static<typeof GameUpdate>;
export const GameUpdate = rt.Record({
    processes: rt.Array(Process),
    memory: rt.Array(MemoryUpdate),
    score: rt.Array(Score)
});