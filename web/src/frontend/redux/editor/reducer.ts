import { State } from '../state';
import { EditorActions } from './actions';
import { editorInitialState } from './state';
import { catchUnhandledAction } from '../utils';
import { storage } from 'frontend/services/storage';

export function editorReducer(state: State['editor'] | undefined, action: EditorActions): State['editor'] {
    if (state === undefined) {
        return editorInitialState();
    }
    switch (action.type) {
        case 'loadCode':
            storage.saveCode(action.payload);
            return {
                ...state,
                code: action.payload
            };
        case 'unloadCode':
            storage.clearCode();
            return {
                ...state,
                code: null
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}