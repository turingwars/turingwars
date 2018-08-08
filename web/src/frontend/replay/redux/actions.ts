import { GameUpdate } from 'model/GameUpdate';
import { GameResult } from './state';

export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function publishGameUpdate(update: GameUpdate) {
    return baseAction('publishGameUpdate', update);
}

/**
 * Game ended by one or two players reaching the goal.
 */
export function publishVictory(result: GameResult) {
    return baseAction('publishGameEnd', result);
}

/**
 * Game ended by timeout.
 */
export function publishGameOver() {
    return baseAction('publishGameOver', null);
}

export function clearMemory() {
    return baseAction('clearMemory', null);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof publishGameUpdate> |
        ReturnType<typeof publishVictory> |
        ReturnType<typeof publishGameOver> |
        ReturnType<typeof clearMemory>;
