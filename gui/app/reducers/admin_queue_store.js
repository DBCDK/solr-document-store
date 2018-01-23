import adminQueueRootReducer from "./admin_queue_root_reducer";
import config from "./configure_store";

export default initialState => config(adminQueueRootReducer, initialState);
