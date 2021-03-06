import { Process, GameUpdate } from 'shared/model/GameUpdate';
import { nop, Instruction } from 'shared/model/Instruction';
import { CORESIZE } from 'shared/constants';

export interface IPrintableMemoryCell {
    instr: Instruction;
    owner: number;
    changed: number;
}

export type GameResult = {
    type: 'DRAW'
} | {
    type: 'VICTORY',
    winner: string
};


const emptyMemory: IPrintableMemoryCell[] = (() => {
    const memory: IPrintableMemoryCell[] = new Array(CORESIZE);
    const NOP = nop();
    for (let i = 0 ; i < CORESIZE ; i++) {
        memory[i] = {
            instr: NOP,
            owner: -1,
            changed: 0
        };
    }
    return memory;
})();

export function playerState(name: string) {
    return {
        name,
        score: 0
    };
}

export type PlayerState = ReturnType<typeof playerState>;

export function replayInitialState() {
    return {
        memory: emptyMemory,
        changedCells: [] as number[],
        processes: [] as Process[],
        gameResult: null as GameResult | null,
        gameStarted: false,
        player1: playerState('player 1'),
        player2: playerState('player 2'),
        loadedGame: null as null | LoadedGame
    };
}

export interface LoadedGame {
    player1Name: string;
    player2Name: string;
    log: GameUpdate[];
}


export type ReplayState = ReturnType<typeof replayInitialState>;
