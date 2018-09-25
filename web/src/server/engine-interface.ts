import * as rt from "runtypes";

export const Process = rt.Record({
    processId: rt.String,
    instructionPointer: rt.Number,
    isAlive: rt.Boolean
});

export const InstructionField = rt.Record({
    fieldType: rt.String,
    value: rt.Number,
    field: rt.String
});

export const Instruction = rt.Record({
    op: rt.String,
    a: InstructionField,
    b: InstructionField
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

export const GameUpdate = rt.Record({
    processes: rt.Array(Process),
    memory: rt.Array(MemoryUpdate),
    score: rt.Array(Score)
});

export const EngineRunResult = rt.Array(GameUpdate);
