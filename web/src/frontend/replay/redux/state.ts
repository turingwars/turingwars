import { Process } from 'model/GameUpdate';
import { Instruction } from 'model/Instruction';

export interface IStartupProps {
    gameId: string;
    player1Name: string;
    player2Name: string;
}

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

function playerState(name: string) {
    return {
        name,
        score: 0
    };
}

export type PlayerState = ReturnType<typeof playerState>;

export function initialState(props: IStartupProps) {
    return {
        gameId: props.gameId,
        memory: [] as IPrintableMemoryCell[],
        changedCells: [] as number[][],
        processes: [] as Process[],
        player1: playerState(props.player1Name),
        player2: playerState(props.player2Name),
        gameResult: null as GameResult | null,
        gameStarted: false
    };
}

export type State = ReturnType<typeof initialState>;
