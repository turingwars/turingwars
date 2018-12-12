import { GameUpdate } from 'shared/model/GameUpdate';
import { GameResult, LoadedGame } from './state';
import { baseAction } from '../utils';

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

export function startGame() {
    return baseAction('startGame', null);
}

export function resetReplay() {
    return baseAction('resetReplay', null);
}

export function initPlayers(p1Name: string, p2Name: string) {
    return baseAction('initPlayers', {
        p1Name, p2Name
    });
}

export function loadGame(loadedGame: LoadedGame) {
    return baseAction('loadGame', loadedGame);
}

/**
 * Join here all possible actions
 */
export type ReplayActions =
        ReturnType<typeof startGame> |
        ReturnType<typeof publishGameUpdate> |
        ReturnType<typeof publishVictory> |
        ReturnType<typeof publishGameOver> |
        ReturnType<typeof resetReplay> |
        ReturnType<typeof initPlayers> |
        ReturnType<typeof loadGame>;
