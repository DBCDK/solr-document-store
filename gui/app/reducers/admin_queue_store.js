import adminQueueRootReducer from "./admin_queue_root_reducer";
import config from "./configure_store";
import rootSaga from "../sagas/admin_queue_sagas";

export default initialState =>
  config(adminQueueRootReducer, rootSaga, initialState);
