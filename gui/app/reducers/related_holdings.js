import {
  PULL_RELATED_HOLDINGS,
  PULL_RELATED_HOLDINGS_SUCCESS,
  PULL_RELATED_HOLDINGS_FAILED
} from "../actions/related_holdings";
import { SELECT_BIB_RECORD } from "../actions/global";
import update from "immutability-helper";

export const produceInitialState = () => ({
  loading: false,
  relatedHoldings: [],
  errorMessage: ""
});

export default function relatedHoldings(
  state = produceInitialState(),
  action = {}
) {
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
    case PULL_RELATED_HOLDINGS_SUCCESS:
      // Handling invalid actions
      let result =
        action.result && Array.isArray(action.result) ? action.result : [];
      return update(state, {
        loading: { $set: false },
        errorMessage: { $set: "" },
        relatedHoldings: { $set: result }
      });
    case PULL_RELATED_HOLDINGS_FAILED:
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
