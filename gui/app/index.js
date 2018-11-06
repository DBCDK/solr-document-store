// Needs to be in the global namespace for redux-saga to work
import regeneratorRuntime from "regenerator-runtime/runtime";
const React = require("react");
const ReactDOM = require("react-dom");
// Main app
import SolrDocstoreGUI from "./components/solr-docstore-gui";
// Redux related
import { Provider } from "react-redux";
import configureStore from "./reducers/docstore_gui_store";

// Webpack will bundle styling
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <SolrDocstoreGUI />
  </Provider>,
  document.getElementById("solr-docstore-gui-root")
);
