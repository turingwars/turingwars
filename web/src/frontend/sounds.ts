import {Howl} from 'howler'

const SOUNDS_FOLDERS = 'sounds/'

const SOUNDS_FILES = {
    beep: 'beep-07.mp3',
    fight: 'beep-21.mp3', // TODO: wrong, replace
    you_win: 'beep-21.mp3', // TODO: wrong, replace
    you_loose: 'beep-21.mp3', // TODO: wrong, replace
}

// A sound, e.g, beep, flight, you_win, you_loose
export type Sound = keyof typeof SOUNDS_FILES;

export class Sounds {

    // Plays the sound exactly once
    public static play(sound: Sound): void {

        new Howl({
            src: [SOUNDS_FOLDERS + SOUNDS_FILES[sound]]
        }).play();
    }
}