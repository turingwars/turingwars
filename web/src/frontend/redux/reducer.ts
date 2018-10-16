import { replayReducer } from './replay/reducer';
import { State } from './state';
import { combineReducers } from 'redux';
import { editorReducer } from './editor/reducer';
import { ReplayActions } from './replay/actions';
import { EditorActions } from './editor/actions';
import { GlobalActions } from './actions';

export type AppActions = ReplayActions | EditorActions;

export const reducer = combineReducers<State>({
    replay: replayReducer,
    editor: editorReducer,
    soundEnabled: soundReducer,
});

export function soundReducer(state: State['soundEnabled'] | undefined, action: GlobalActions): State['soundEnabled'] {
    if (state === undefined) {
        return true;
    }
    switch (action.type) {
        case 'toggleSound':
            return !state;
    }
    return state;
}