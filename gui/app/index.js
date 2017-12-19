// Needs to be in the global namespace for redux-saga to work
import regeneratorRuntime from "regenerator-runtime/runtime";
const React = require("react");
const ReactDOM = require("react-dom");
import { AppContainer } from "react-hot-loader";
// Main app
import SolrDocstoreGUI from "./components/solr-docstore-gui";
// Redux related
import { Provider } from "react-redux";
import configureStore from "./reducers/configure_store";

// Webpack will bundle styling
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

let store = configureStore();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("solr-docstore-gui-root")
  );
};

render(SolrDocstoreGUI);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept(() => {
    render(SolrDocstoreGUI);
  });
}
