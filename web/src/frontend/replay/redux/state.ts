import { Process } from 'model/GameUpdate';
import { Instruction } from 'model/Instruction';

export interface IStartupProps {
    gameId: string;
}

export interface IPrintableMemoryCell {
    instr: Instruction;
    owner: number;
    changed: number;
}

export function initialState(props: IStartupProps) {
    return {
        id: 0,
        gameId: props.gameId,
        memory: [] as IPrintableMemoryCell[],
        changedCells: [] as number[][],
        processes: [] as Process[]
    };
}

export type State = ReturnType<typeof initialState>;
