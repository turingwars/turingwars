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
        <Editor championID={getChampionId()}/>
    </Provider>,
    document.getElementById('app'));

function getChampionId() {
    return parseInt(window.location.hash.substr(1), 10).toString();
}
