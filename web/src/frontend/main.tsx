import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Editor } from './editor/components/Editor';
import { ReplayScreen } from './replay/components/ReplayScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ROUTE_MATCHMAKING, ROUTE_REPLAY, ROUTE_EDITOR } from './navigation';
import { MatchMakingScreen } from './components/screens/MatchMakingScreen';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={HomeScreen} />
            <Route path={`${ROUTE_MATCHMAKING}`} component={MatchMakingScreen} />
            <Route exact path={`${ROUTE_REPLAY}`} component={ReplayScreen} />
            <Route path={`${ROUTE_EDITOR}`} component={Editor} />
        </div>
    </Router>,
    document.getElementById('app'));


