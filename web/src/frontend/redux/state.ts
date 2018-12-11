import { replayInitialState } from './replay/state';
import { editorInitialState } from './editor/state';
import { soundInitialState } from './sounds/state';

export function initialState() {
    return {
        replay: replayInitialState(),
        editor: editorInitialState(),
        sound: soundInitialState(),
    };
}

export type State = ReturnType<typeof initialState>;
