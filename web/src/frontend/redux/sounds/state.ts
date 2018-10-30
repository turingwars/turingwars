export function soundInitialState() {
    return {
        musicEnabled: true,
        audioSFXEnabled: true
    }
}

export type SoundState = ReturnType<typeof soundInitialState>;
