import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, Store } from 'redux';
import { Editor } from './components/Editor';
import { AppActions } from './redux/actions';
import { reducer } from './redux/reducer';
import { initialState, State } from './redux/state';

const store = createStore(reducer, initialState()) as Store<State, AppActions>;

ReactDOM.render(
    <Provider store={store}>
        <Editor championID={getChampionId()} />
    </Provider>,
    document.getElementById('app'));

function getChampionId() {
    const split = window.location.pathname.split('/');
    const id = split[split.length - 1];
    return parseInt(id, 10).toString();
}
