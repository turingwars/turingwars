import { GameUpdate } from 'model/GameUpdate';
import { Store } from 'redux';
import { publishGameUpdate } from '../redux/actions';
import { State } from '../redux/state';

class Player {
    private updates: GameUpdate[];
    private store: Store<State>;

    public init(store: Store<State>) {
        this.store = store;
    }

    public load(updates: GameUpdate[]) {
        this.updates = updates;
    }

    public start() {
        this.step();
    }

    private step() {
        const update = this.updates.shift();
        if (update === undefined) {
            console.log('Finished!');
            return;
        }
        this.store.dispatch(publishGameUpdate(update));
        window.requestAnimationFrame(() => this.step());
    }
}

export const player = new Player();
