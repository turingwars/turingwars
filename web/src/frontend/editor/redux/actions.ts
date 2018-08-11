import { IHero } from '../../../api';

export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function herosListLoadedAction(heros: IHero[]) {
    return baseAction('herosListLoadedAction', heros);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof herosListLoadedAction>;
