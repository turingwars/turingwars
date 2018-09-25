import { Instruction } from './Instruction';

export class GameUpdate {

    public processes: Process[];

    public memory: MemoryUpdate[];

    public score: Score[];
}

export class Process {

    public processId: string;

    public instructionPointer: number;

    public isAlive: boolean;
}

export class MemoryUpdate {
    public address: number;

    /**
     * ID of the user who "caused" this mutation
     */
    public cause: number;

    public value: Instruction;
}

export class Score {
    public playerId: string;

    public score: number;
}
