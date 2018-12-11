import { Sounds } from './sounds';

// Handles the preloader.
// Assumes that the app is structured as follow initially:
//  <div id={DOM_PRELOADER_ID}>Loading...</div>
//  <div id={DOM_APP_ID} style="display:none"><!-- REACT APP HERE --></div>
export abstract class Preloader {

    private static readonly DOM_PRELOADER_ID = 'preloader';
    private static readonly DOM_APP_ID = 'app';
    private static readonly DEFAULT_TIMEOUT_BEFORE_SHOWING_PAGE = 1000;

    // Removes the preloader div immediately
    public static removeImmediately(): void {
        const loaderDiv = document.getElementById(Preloader.DOM_PRELOADER_ID)
        const appDiv = document.getElementById(Preloader.DOM_APP_ID)

        if (loaderDiv == null || appDiv == null) {
            return;
        }

        loaderDiv.remove();
        appDiv.style.display = 'block';

        // start the background music
        Sounds.startMusic();
    }

    // Removes the preloader div after `timeout`
    public static removeAfterTimeOut(timeout: number = Preloader.DEFAULT_TIMEOUT_BEFORE_SHOWING_PAGE): void {
        if (!Preloader.isPreloaderVisible) {
            return;
        }
        setTimeout(() => Preloader.removeImmediately(), timeout)
    }

    // Returns true iff the preloader div is still visible
    public static isPreloaderVisible(): boolean {
        const loaderDiv = document.getElementById(Preloader.DOM_PRELOADER_ID)

        if (loaderDiv != null) {
            return true;
        }
        return false;
    }
}