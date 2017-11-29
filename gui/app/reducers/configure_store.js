import { createStore, combineReducers, applyMiddleware } from "redux";
import rootReducer from "./index";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();

    let store = createStore(
        rootReducer,
        applyMiddleware(sagaMiddleware)
    );
    sagaMiddleware.run(rootSaga);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            console.log("Reload of reducers");
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
        // If running sagas while reloading is an issue: https://gist.github.com/markerikson/dc6cee36b5b6f8d718f2e24a249e0491
        /*module.hot.accept('../sagas/SagaManager', () => {
            SagaManager.cancelSagas(store);
            require('../sagas/SagaManager').default.startSagas(sagaMiddleware);
        });*/
    }

    return store;
};
