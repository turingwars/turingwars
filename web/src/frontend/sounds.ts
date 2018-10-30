import {Howl} from 'howler'
import {store} from './main'

const SOUNDS_FOLDERS = 'sounds/'

const SOUNDS_FILES = {
    beep: 'fatbeep.mp3',
    fight: 'fight.mp3',
    you_win: 'you_win.mp3',
    you_loose: 'you_lose.mp3',
    score_tick: 'score.mp3',
}

// A sound, e.g, beep, flight, you_win, you_loose
export type Sound = keyof typeof SOUNDS_FILES;

export abstract class Sounds {

    private static readonly DEBOUNCE = 100;

    private static debounceLastSoundPlayed: number = -1;

    private static howlerSounds: {[key: string]: Howl};

    // creates the "Howl" wrapper for all sounds
    private static init(){
        this.howlerSounds = {};
        for (const key in SOUNDS_FILES) {
            if (SOUNDS_FILES.hasOwnProperty(key)) {
                this.howlerSounds[key] = new Howl({
                    src: [SOUNDS_FOLDERS + SOUNDS_FILES[key as Sound]]
                });
            }
        }
    }

    // Plays the sound exactly once
    public static playSFX(sound: Sound): void {

        if (!store.getState().sound.audioSFXEnabled){
            return
        }

        if (this.howlerSounds === undefined) {
            this.init();
        }

        this.howlerSounds[sound].play();
    }

    public static playSFXDebounced(sound: Sound, debounce: number = this.DEBOUNCE) {

        const now = new Date().getTime();
        const diff = now - this.debounceLastSoundPlayed;

        if(this.debounceLastSoundPlayed == -1 || diff > debounce) {
            this.debounceLastSoundPlayed = now
            this.playSFX(sound);
        }
    }

    // Stops all sounds
    public static stopAllSFX() {
        for(const key in this.howlerSounds) {
            this.howlerSounds[key].stop();
        }
    }
}
