import { AppActions } from './actions';
import { State } from './state';

export function reducer(state: State | undefined, action: AppActions): State {
    if (state == undefined) {
        throw new Error('Unexpected undefined state!');
    }
    switch (action.type) {
        case 'herosListLoadedAction':
            return { ...state, heros: action.payload };
    }
    return state;
}