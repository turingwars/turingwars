
import { baseAction } from './utils';

export function toggleSound() {
    return baseAction('toggleSound', null);
}

export type GlobalActions = ReturnType<typeof toggleSound>