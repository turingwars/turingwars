import { GameUpdate } from 'model/GameUpdate';

export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function publishGameUpdate(update: GameUpdate) {
    return baseAction('publishGameUpdate', update);
}

export function clearMemory() {
    return baseAction('clearMemory', null);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof publishGameUpdate> |
        ReturnType<typeof clearMemory>;
