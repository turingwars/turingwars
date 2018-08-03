import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import { createStore, Store } from 'redux';
import { Editor } from './components/Editor';
import { AppActions } from './redux/actions';
import { reducer } from './redux/reducer';
import { initialState, State } from './redux/state';
import { HomePage } from './components/HomePage';

const store = createStore(reducer, initialState()) as Store<State, AppActions>;

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={HomePage} />
                <Route path="/editor" component={Editor}/>
            </div>
        </Router>
    </Provider>,
    document.getElementById('app'));

function getChampionId() {
    return parseInt(window.location.hash.substr(1), 10).toString();
}
