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

    // Plays the sound exactly once
    public static play(sound: Sound): void {

        if (!store.getState().soundEnabled){
            return
        }

        new Howl({
            src: [SOUNDS_FOLDERS + SOUNDS_FILES[sound]]
        }).play();
    }
}
