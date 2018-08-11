import { State } from '../state';
import { EditorActions } from './actions';
import { editorInitialState } from './state';
import { catchUnhandledAction } from '../utils';

export function editorReducer(state: State['editor'] | undefined, action: EditorActions): State['editor'] {
    if (state === undefined) {
        return editorInitialState();
    }
    switch (action.type) {
        case 'loadCode':
            return {
                ...state,
                code: action.payload
            };
        case 'unloadCode':
            return {
                ...state,
                code: null
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}