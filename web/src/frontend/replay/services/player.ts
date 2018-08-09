import { GameUpdate } from 'model/GameUpdate';
import { Store } from 'redux';
import { publishGameUpdate, publishVictory, publishGameOver, startGame } from '../redux/actions';
import { State } from '../redux/state';

// AnimationFrame fires at 60 or 30 FPS. 60FPS is too fast so we artificially cap the framerate
// at 30FPS by skipping a frame when necessary.
// This has two advantages: The simulation is easier to watch than at 60FPS, and it will run at the
// same speed no matter the hardware and system the game runs on.
// 30 FPS is 33ms per frame and 60FPS is 16ms. 25ms is arbitrarilly chosen within this interval.
const THROTTLING_MS = 25;

class Player {
    private updates: GameUpdate[];
    private store: Store<State>;

    private lastTime = 0;

    public init(store: Store<State>) {
        this.store = store;
    }

    public load(updates: GameUpdate[]) {
        this.updates = updates;
    }

    public start() {
        window.requestAnimationFrame(() => this.onAnimationFrame());
    }

    private onAnimationFrame() {
        let shouldContinue = true;
        
        // Artificially limit the number of FPS
        const time = Date.now();
        if (time - this.lastTime > THROTTLING_MS) {
            shouldContinue = this.doStep();
            this.lastTime = time;
        }
        
        if (shouldContinue) {
            window.requestAnimationFrame(() => this.onAnimationFrame());
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

        if (this.store.getState().gameResult == null) {
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
