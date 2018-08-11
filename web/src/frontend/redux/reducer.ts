import { CHANGE_BUFFER_LENGTH } from '../style';
import { AppActions } from './actions';
import { playerState, State, replayInitialState } from './state';

export function reducer(state: State | undefined, action: AppActions): State {
    if (state == undefined) {
        throw new Error('Unexpected undefined state!');
    }
    return {
        ...state,
        replay: replayReducer(state.replay, action)
    };
}

function replayReducer(state: State['replay'], action: AppActions): State['replay'] {
    switch (action.type) {
        case 'publishGameUpdate': {
            const memory = state.memory.slice();
            // Clear old changed cells
            if (state.changedCells.length >= CHANGE_BUFFER_LENGTH) {
                for (const address of state.changedCells[0]) {
                    memory[address] = {
                        ...memory[address],
                        changed: memory[address].changed - 1
                    };
                }
            }
            const changedCells = state.changedCells.length >= CHANGE_BUFFER_LENGTH ?
                state.changedCells.slice(state.changedCells.length - CHANGE_BUFFER_LENGTH + 1) :
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

function catchUnhandledAction(_action: never) {
    // Throws a type error at compile time if an action is missing, but doesn't do
    // anything at runtime to prevent crashing for no good reason.
}