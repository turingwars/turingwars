import { State } from '../state';
import { SoundActions } from './actions';
import { soundInitialState } from './state';
import { catchUnhandledAction } from '../utils';
import { Sounds } from 'frontend/sounds';
import { storage } from 'frontend/services/storage';

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
                // start the background music. Force=true since Redux's state update is async, and might happen in a little while.
                // We don't care if the music and the state are slightly desynchronized, as long as it's not noticeable by the user
                Sounds.forceStartMusic();
            }

            storage.saveMusicStatus(newMusicState);
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

            storage.saveAudioSFXStatus(newAudioSFXState);
            return {
                ...state,
                audioSFXEnabled: newAudioSFXState
            };
        default:
            catchUnhandledAction(action);
    }
    return state;
}
