// Needs to be in the global namespace for redux-saga to work
import regeneratorRuntime from "regenerator-runtime/runtime";
const React = require("react");
const ReactDOM = require("react-dom");
// Main app
import SolrDocstoreGUI from './components/solr-docstore-gui';
// Redux related
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import * as reducers from "./reducers";
import rootSaga from './sagas';

// Webpack will bundle styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        ...reducers
        //apollo: client.reducer()
    }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <SolrDocstoreGUI/>
    </Provider>,
    document.getElementById('solr-docstore-gui-root')
);
