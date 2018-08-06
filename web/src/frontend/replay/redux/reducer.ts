import { nop } from 'model/Instruction';
import { CONSTANTS } from '../constants';
import { AppActions } from './actions';
import { IPrintableMemoryCell, State } from './state';

export function reducer(state: State, action: AppActions): State {
    switch (action.type) {
        case 'clearMemory': {
            const memory: IPrintableMemoryCell[] = new Array(2116);
            const NOP = nop();
            for (let i = 0 ; i < 2116 ; i++) {
                memory[i] = {
                    instr: NOP,
                    owner: -1,
                    changed: 0
                };
            }
            return { ...state, memory };
        }
        case 'publishGameUpdate': {
            // TODO: An immutable array implementation would be much more memory efficient here
            const memory = state.memory.slice();

            // Clear old changed cells
            if (state.changedCells.length >= CONSTANTS.changeBufferLength) {
                for (const address of state.changedCells[0]) {
                    memory[address] = {
                        ...memory[address],
                        changed: memory[address].changed - 1
                    };
                }
            }
            const changedCells = state.changedCells.length >= CONSTANTS.changeBufferLength ?
                state.changedCells.slice(state.changedCells.length - CONSTANTS.changeBufferLength + 1) :
                state.changedCells.slice();
            const changedNow: number[] = [];
            // populate new changes
            for (const m of action.payload.memory) {
                memory[m.address] = {
                    instr: m.value,
                    owner: m.cause,
                    changed: memory[m.address].changed + 1
                };
                changedNow.push(m.address);
            }
            changedCells.push(changedNow);
            return { ...state, id: state.id + 1, memory, processes: action.payload.processes, changedCells };
        }
    }
    return state;
}
