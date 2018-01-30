import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

export default function config(
  rootReducer,
  rootSagas,
  customMiddlewares,
  initialState = undefined
) {
  //const sagaMiddleware = createSagaMiddleware();
  const sagaMiddlewares = rootSagas.map(saga => ({
    saga,
    middleware: createSagaMiddleware()
  }));

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        ...customMiddlewares,
        ...sagaMiddlewares.map(sm => sm.middleware)
      )
    )
  );
  sagaMiddlewares.forEach(sm => {
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
