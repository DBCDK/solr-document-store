import {
  PULL_RELATED_RESOURCES_SUCCESS,
  PULL_RELATED_RESOURCES_FAILED
} from "../actions/related_resources";
import { SELECT_BIB_RECORD } from "../actions/global";
import update from "immutability-helper";

export const produceInitialState = () => ({
  loading: false,
  resources: [],
  errorMessage: ""
});

export default function relatedResources(
  state = produceInitialState(),
  action = {}
) {
  console.log(action.type);
  switch (action.type) {
    case SELECT_BIB_RECORD:
      // handling invalid actions
      let validAction =
        !!action.item &&
        action.item.bibliographicRecordId !== undefined &&
        action.item.agencyId !== undefined;
      return update(state, {
        loading: { $set: validAction },
        errorMessage: { $set: "" }
      });
    case PULL_RELATED_RESOURCES_SUCCESS:
      // Handling invalid actions
      console.log("before: " + JSON.stringify(action.result));
      let result =
        action.result && Array.isArray(action.result) ? action.result : [];
      console.log("after: " + JSON.stringify(result));
      return update(state, {
        loading: { $set: false },
        errorMessage: { $set: "" },
        resources: { $set: result }
      });
    case PULL_RELATED_RESOURCES_FAILED:
      // Handling invalid action, will ignored
      let message =
        action.message && typeof action.message === "string"
          ? action.message
          : "";
      return update(state, {
        loading: { $set: false },
        errorMessage: { $set: message }
      });
    default:
      return state;
  }
}
