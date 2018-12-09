import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import { createStore, Store } from 'redux';
import { EditMenuScreen } from './components/screens/EditMenuScreen';
import { EditorScreen } from './components/screens/EditorScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { LoadHeroScreen } from './components/screens/LoadHeroScreen';
import { MatchMakingScreen } from './components/screens/MatchMakingScreen';
import { PlaytestOponentPickerScreen } from './components/screens/PlaytestOponentPickerScreen';
import { PublishHeroScreen } from './components/screens/PublishHeroScreen';
import { ReplayScreen } from './components/screens/ReplayScreen';
import { AppActions, reducer } from './redux/reduer';
import { initialState, State } from './redux/state';
import { ROUTE_CREATE_HERO, ROUTE_EDITOR, ROUTE_IMPORT_HERO, ROUTE_LEADERBOARD, ROUTE_MATCHMAKING, ROUTE_PLAYTEST, ROUTE_PUBLISH_HERO, ROUTE_REPLAY } from './services/navigation';
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
                <Route exact path={ROUTE_MATCHMAKING} component={MatchMakingScreen} />
                <Route path={`${ROUTE_REPLAY}/:gameId`} component={ReplayScreen} />
                <Route exact path={ROUTE_LEADERBOARD} component={LeaderboardScreen} />
                <Route exact path={ROUTE_IMPORT_HERO} component={LoadHeroScreen} />
                <Route exact path={ROUTE_EDITOR} component={EditorScreen} />
                <Route exact path={ROUTE_CREATE_HERO} component={EditMenuScreen} />
                <Route exact path={ROUTE_PLAYTEST} component={PlaytestOponentPickerScreen} />
                <Route exact path={ROUTE_PUBLISH_HERO} component={PublishHeroScreen} />
            </div>
        </Provider>
    </Router>,
    document.getElementById('app'));


