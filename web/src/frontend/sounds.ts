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

    private static audioSFX: {[key: string]: Howl};

    public static readonly BACKGROUND_MUSIC_VOLUME = 0.2;
    private static currentBackgroundMusic: Track | undefined;

    // creates the "Howl" wrapper for all sounds
    private static init(){
        this.audioSFX = {};
        for (const key in SOUNDS_FILES) {
            if (SOUNDS_FILES.hasOwnProperty(key)) {
                this.audioSFX[key] = new Howl({
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

        if (this.audioSFX === undefined) {
            this.init();
        }

        this.audioSFX[sound].play();
    }

    // Plays the sound exactly once, except if another SFX sound was played in the last DEBOUNCE ms
    public static playSFXDebounced(sound: Sound, debounce: number = this.DEBOUNCE) {

        const now = new Date().getTime();
        const diff = now - this.debounceLastSoundPlayed;

        if(this.debounceLastSoundPlayed == -1 || diff > debounce) {
            this.debounceLastSoundPlayed = now
            this.playSFX(sound);
        }
    }

    // Stops all SFX sounds
    public static stopAllSFX() {
        for(const key in this.audioSFX) {
            this.audioSFX[key].stop();
        }
    }

    // Stops all music
    public static stopAllMusic() {
        if (this.currentBackgroundMusic !== undefined) {
            this.currentBackgroundMusic.sound.stop();
            this.currentBackgroundMusic = undefined;
        }
    }

    public static startMusic() {
        //temporary
        this.currentBackgroundMusic = new Track('uncredited audio, sorry', 'track1.mp3', true);
    }
}

class Track {
    public sound: Howl;

    constructor(public name: string, audioFile: string, autoplay: boolean, loop: boolean = true) {
        this.sound = new Howl({
            src: [SOUNDS_FOLDERS + audioFile],
            loop: loop,
            volume: Sounds.BACKGROUND_MUSIC_VOLUME
        })

        if (autoplay) {
            this.sound.play();
        }
    }
}