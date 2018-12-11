import { replayReducer } from './replay/reducer';
import { State } from './state';
import { combineReducers } from 'redux';
import { editorReducer } from './editor/reducer';
import { ReplayActions } from './replay/actions';
import { EditorActions } from './editor/actions';
import { soundReducer } from './sounds/reducer';

export type AppActions = ReplayActions | EditorActions;

export const reducer = combineReducers<State>({
    replay: replayReducer,
    editor: editorReducer,
    sound: soundReducer,
});
