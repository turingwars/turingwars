import { baseAction } from '../utils';


export function loadCode(code: string) {
    return baseAction('loadCode', code);
}

export function unloadCode() {
    return baseAction('unloadCode', null);
}
/**
 * Join here all possible actions
 */
export type EditorActions =
        ReturnType<typeof loadCode> |
        ReturnType<typeof unloadCode>;
