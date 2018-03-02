import regeneratorRuntime from "regenerator-runtime/runtime";
const React = require("react");
const ReactDOM = require("react-dom");
import { AppContainer } from "react-hot-loader";
import QueueAdminGUI from "./components/queue-admin-gui";
import { Provider } from "react-redux";
import configureStore from "./reducers/admin_queue_store";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { pullQueueRules } from "./actions/queues";
import { requestAsyncJobList } from "./actions/async_job";

let store = configureStore();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("queue-admin-gui-root")
  );
};

render(QueueAdminGUI);
// Initial loading of queue rules to populate UI with data
store.dispatch(pullQueueRules());
// Initial retrieve of async jobs
store.dispatch(requestAsyncJobList());

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept(() => {
    render(QueueAdminGUI);
  });
}
