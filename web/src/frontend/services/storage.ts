
const CODE_STORAGE_KEY = 'tw-editor-code';
const MUSIC_STATUS_STORAGE_KEY = 'tw-music';
const AUDIO_SFX_STATUS_STORAGE_KEY = 'tw-audiosfx';

class Storage {

    public saveCode(code: string): void {
        localStorage.setItem(CODE_STORAGE_KEY, code);
    }

    public clearCode(): void {
        localStorage.removeItem(CODE_STORAGE_KEY)
    }

    public loadCode(): string | null {
        return localStorage.getItem(CODE_STORAGE_KEY);
    }

    public saveMusicStatus(status: boolean): void {
        var str = 'on';
        if (!status) {
            str = 'off';
        }
        localStorage.setItem(MUSIC_STATUS_STORAGE_KEY, str);
    }

    public getMusicStatus(): boolean {
        return localStorage.getItem(MUSIC_STATUS_STORAGE_KEY) !== 'off';
    }

    public saveAudioSFXStatus(status: boolean): void {
        var str = 'on';
        if (!status) {
            str = 'off';
        }
        localStorage.setItem(AUDIO_SFX_STATUS_STORAGE_KEY, str);
    }

    public getAudioSFXStatus(): boolean {
        return localStorage.getItem(AUDIO_SFX_STATUS_STORAGE_KEY) !== 'off';
    }
}

export const storage = new Storage();