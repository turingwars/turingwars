import { ReplayActions } from './actions';
import { playerState, ReplayState, replayInitialState } from './state';
import { catchUnhandledAction } from '../utils';


export function replayReducer(state: ReplayState | undefined, action: ReplayActions): ReplayState {
    if (state === undefined) {
        return replayInitialState();
    }
    switch (action.type) {
        case 'publishGameUpdate': {
            const memory = state.memory.slice();
            // Clear old changed cells
            for (const address of state.changedCells) {
                memory[address] = {
                    ...memory[address],
                    changed: memory[address].changed - 1
                };
            }
            const changedCells: number[] = [];
            // populate new changes
            for (const m of action.payload.memory) {
                memory[m.address] = {
                    instr: m.value,
                    owner: m.cause,
                    changed: memory[m.address].changed + 1
                };
                changedCells.push(m.address);
            }

            // Update players
            const player1 = {
                name: state.player1.name,
                score: action.payload.score[0].score
            };

            const player2 = {
                name: state.player2.name,
                score: action.payload.score[1].score
            };

            return { ...state,
                memory,
                processes: action.payload.processes,
                changedCells,
                player1, player2
            };
        }
        case 'publishGameEnd':
            return {
                ...state,
                gameResult: action.payload
            };
        case 'publishGameOver':
            if (state.player1.score == state.player2.score) {
                return {
                    ...state,
                    gameResult: {
                        type: 'DRAW'
                    }
                };
            }
            const winner = state.player1.score > state.player2.score ? '0' : '1';
            return {
                ...state,
                gameResult: {
                    type: 'VICTORY',
                    winner: winner
                }
            }
        case 'startGame':
            return { ...state, gameStarted: true };
        case 'resetReplay':
            return replayInitialState();
        case 'initPlayers':
            return { ...state,
                player1: playerState(action.payload.p1Name),
                player2: playerState(action.payload.p2Name)
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}
