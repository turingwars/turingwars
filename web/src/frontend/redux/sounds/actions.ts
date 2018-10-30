import { baseAction } from '../utils';

export function toggleMusic() {
    return baseAction('toggleMusic', null);
}

export function toggleSFX() {
    return baseAction('toggleSFX', null);
}
/**
 * Join here all possible actions
 */
export type SoundActions =
        ReturnType<typeof toggleMusic> |
        ReturnType<typeof toggleSFX>;
