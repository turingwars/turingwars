import { AppActions } from './actions';
import { State } from './state';

export function reducer(state: State, action: AppActions): State {
    if (action.type.startsWith('@@')) {
        return state;
    }
    switch (action.type) {
        case 'herosListLoadedAction':
            return { ...state, heros: action.payload };
    }
}
