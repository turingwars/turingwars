import { GameUpdate } from 'shared/model/GameUpdate'
import { Store } from 'redux';
import { AppActions } from 'frontend/redux/reducer';
import { publishGameOver, publishGameUpdate, publishVictory, resetReplay } from 'frontend/redux/replay/actions';
import { State } from 'frontend/redux/state';

// AnimationFrame fires at 60 or 30 FPS. 60FPS is too fast so we artificially cap the framerate
// at 30FPS by skipping a frame when necessary.
// This has two advantages: The simulation is easier to watch than at 60FPS, and it will run at the
// same speed no matter the hardware and system the game runs on.
// 30 FPS is 33ms per frame and 60FPS is 16ms. 25ms is arbitrarilly chosen within this interval.
const THROTTLING_MS = 25;

class Player {
    private updates: GameUpdate[];
    private store: Store<State, AppActions>;

    private lastTime = 0;

    private isRunning = false;
    private animFramePending = false;

    public init(store: Store<State, AppActions>) {
        this.store = store;
    }

    public reset() {
        this.isRunning = false;
        this.store.dispatch(resetReplay());
    }

    public load(updates: GameUpdate[]) {
        this.updates = updates;
    }

    public start() {
        if (this.isRunning) {
            throw new Error('The player is already running. Something must be buggy...');
        }
        this.isRunning = true;
        if (!this.animFramePending) {
            this.animFramePending = true;
            window.requestAnimationFrame(() => this.onAnimationFrame());
        }
    }

    private onAnimationFrame() {
        this.animFramePending = false;
        if (this.isRunning === false) {
            return;
        }

        let shouldContinue = true;
        
        // Artificially limit the number of FPS
        const time = Date.now();
        if (time - this.lastTime > THROTTLING_MS) {
            shouldContinue = this.doStep();
            this.lastTime = time;
        }
        
        if (shouldContinue) {
            this.animFramePending = true;
            window.requestAnimationFrame(() => this.onAnimationFrame());
        } else {
            this.isRunning = false;
        }
    }

    /**
     * @return `shouldContinue`: true if the simulation should continue after this frame.
     */
    private doStep(): boolean {
        const update = this.updates.shift();
        if (update === undefined) {
            this.store.dispatch(publishGameOver());
            return false;
        }
        this.store.dispatch(publishGameUpdate(update));

        if (this.store.getState().replay.gameResult == null) {
            this.checkScores(update);
        }
        
        return true;
    }

    private checkScores(update: GameUpdate) {
        const winners = update.score.filter((s) => s.score >= 1000).map((s) => s.playerId);
        if (winners.length > 0) {
            if (winners.length === 1) {
                this.store.dispatch(publishVictory({
                    type: 'VICTORY',
                    winner: winners[0]
                }));
            } else {
                // Both players made it to 1k at the same time!
                this.store.dispatch(publishVictory({
                    type: 'DRAW'
                }));
            }
        }
    }
}

export const player = new Player();
