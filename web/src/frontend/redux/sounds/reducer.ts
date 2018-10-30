import { State } from '../state';
import { SoundActions } from './actions';
import { soundInitialState } from './state';
import { catchUnhandledAction } from '../utils';

export function soundReducer(state: State['sound'] | undefined, action: SoundActions): State['sound'] {
    if (state === undefined) {
        return soundInitialState();
    }
    switch (action.type) {
        case 'toggleMusic':
            return {
                ...state,
                musicEnabled: !state.musicEnabled
            };
        case 'toggleSFX':
            return {
                ...state,
                audioSFXEnabled: !state.audioSFXEnabled
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}
