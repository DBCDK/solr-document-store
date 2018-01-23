import docstoreGuiRootReducer from "./index";
import config from "./configure_store";

export default initialState => config(docstoreGuiRootReducer, initialState);
