import { State } from '../state';
import { SoundActions } from './actions';
import { soundInitialState } from './state';
import { catchUnhandledAction } from '../utils';
import { Sounds } from 'frontend/sounds';

export function soundReducer(state: State['sound'] | undefined, action: SoundActions): State['sound'] {
    if (state === undefined) {
        return soundInitialState();
    }
    switch (action.type) {
        case 'toggleMusic':
            const newMusicState = !state.musicEnabled
            if(newMusicState == false) {
                // in addition to updating the state, kill all current music
                Sounds.stopAllMusic();
            } else {
                // start the background music
                Sounds.startMusic();
            }
            return {
                ...state,
                musicEnabled: newMusicState
            };
        case 'toggleSFX':
            const newAudioSFXState = !state.audioSFXEnabled
            if(newAudioSFXState == false) {
                // in addition to updating the state, kill all current music
                Sounds.stopAllSFX();
            }
            return {
                ...state,
                audioSFXEnabled: newAudioSFXState
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}
