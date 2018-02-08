import adminQueueRootReducer from "./admin_queue_root_reducer";
import config from "./configure_store";
import rootSaga from "../sagas/admin_queue_sagas";
import wsSaga, { socketMiddleware } from "../sagas/admin_queue_ws_sagas";

export default initialState =>
  config(
    adminQueueRootReducer,
    [rootSaga, wsSaga],
    [socketMiddleware],
    initialState
  );
