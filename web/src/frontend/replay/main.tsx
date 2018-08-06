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
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: undefined | Function; }
}

const store = createStore(reducer, initialState({
    gameId: getGameID()
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
