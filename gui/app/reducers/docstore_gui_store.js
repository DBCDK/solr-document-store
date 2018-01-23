import docstoreGuiRootReducer from "./index";
import config from "./configure_store";
import rootSaga from "../sagas/docstore_gui_sagas";

export default initialState =>
  config(docstoreGuiRootReducer, rootSaga, initialState);
