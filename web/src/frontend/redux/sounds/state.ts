import { storage } from 'frontend/services/storage';

export function soundInitialState() {
    return {
        musicEnabled: storage.getMusicStatus(),
        audioSFXEnabled: storage.getAudioSFXStatus(),
    }
}

export type SoundState = ReturnType<typeof soundInitialState>;
