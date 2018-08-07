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

function playerState(name: string) {
    return {
        name,
        score: 0
    };
}

export function initialState(props: IStartupProps) {
    return {
        id: 0,
        gameId: props.gameId,
        memory: [] as IPrintableMemoryCell[],
        changedCells: [] as number[][],
        processes: [] as Process[],
        player1: playerState(props.player1Name),
        player2: playerState(props.player2Name),
    };
}

export type State = ReturnType<typeof initialState>;
