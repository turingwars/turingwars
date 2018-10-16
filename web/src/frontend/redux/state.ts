import { replayInitialState } from './replay/state';
import { editorInitialState } from './editor/state';

export function initialState() {
    return {
        replay: replayInitialState(),
        editor: editorInitialState(),
        soundEnabled: true,
    };
}


export type State = ReturnType<typeof initialState>;
