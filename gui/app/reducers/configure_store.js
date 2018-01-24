import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

export default function config(
  rootReducer,
  rootSagas,
  initialState = undefined
) {
  //const sagaMiddleware = createSagaMiddleware();
  const sagaMiddleware = rootSagas.map(saga => ({
    saga,
    middleware: createSagaMiddleware()
  }));

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...sagaMiddleware.map(sm => sm.middleware))
    )
  );
  sagaMiddleware.forEach(sm => {
    sm.middleware.run(sm.saga);
  });
  //sagaMiddleware.run(rootSaga);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers", () => {
      console.log("Reload of reducers");
      const nextRootReducer = require("../reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
