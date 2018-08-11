import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import { createStore, Store } from 'redux';
import { EditorScreen } from './components/screens/EditorScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MatchMakingScreen } from './components/screens/MatchMakingScreen';
import { ReplayScreen } from './components/screens/ReplayScreen';
import { ROUTE_EDITOR, ROUTE_MATCHMAKING, ROUTE_REPLAY } from './navigation';
import { AppActions } from './redux/actions';
import { reducer } from './redux/reducer';
import { initialState, State } from './redux/state';
import { player } from './services/player';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: undefined | Function;
    }
}

// Initialize redux store and services
const store: Store<State, AppActions> = createStore(reducer, initialState(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
player.init(store);


ReactDOM.render(
    <Router>
        <Provider store={store}>
            <div>
                <Route exact path="/" component={HomeScreen} />
                <Route path={`${ROUTE_MATCHMAKING}`} component={MatchMakingScreen} />
                <Route path={`${ROUTE_REPLAY}/:gameId`} component={ReplayScreen} />
                <Route path={`${ROUTE_EDITOR}`} component={EditorScreen} />
            </div>
        </Provider>
    </Router>,
    document.getElementById('app'));


