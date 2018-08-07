import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { ReplayScreen } from './components/ReplayScreen';
import { AppActions, clearMemory } from './redux/actions';
import { reducer } from './redux/reducer';
import { initialState, State } from './redux/state';
import { player } from './services/player';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: undefined | Function;
        PLAYER_1_NAME: string;
        PLAYER_2_NAME: string;
    }
}

const store = createStore(reducer, initialState({
    gameId: getGameID(),
    player1Name: window.PLAYER_1_NAME,
    player2Name: window.PLAYER_2_NAME
}),
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) as Store<State, AppActions>;
store.dispatch(clearMemory());

ReactDOM.render(
    <Provider store={store}>
        <ReplayScreen />
    </Provider>,
    document.getElementById('app'));

function getGameID() {
    const split = window.location.pathname.split('/');
    const id = split[split.length - 1];
    return parseInt(id, 10).toString();
}

player.init(store);
