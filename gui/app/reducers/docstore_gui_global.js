import { SELECT_BIB_RECORD } from "../actions/global";
import update from "immutability-helper";

export const produceInitialState = () => ({
  selectedBibRecordId: null,
  selectedBibAgencyId: null
});

export default function global(state = produceInitialState(), action = {}) {
  switch (action.type) {
    case SELECT_BIB_RECORD:
      let validAction =
        !!action.item &&
        action.item.bibliographicRecordId !== undefined &&
        action.item.agencyId !== undefined;
      action.item = action.item
        ? action.item
        : {
            bibliographicRecordId: null,
            agencyId: null
          };
      let actionBibId = action.item.bibliographicRecordId;
      let actionAgencyId = action.item.agencyId;
      // If values are undefined, set to null instead
      let bibRecordId = validAction && actionBibId ? actionBibId : null;
      let agencyId = validAction && actionAgencyId ? actionAgencyId : null;
      return update(state, {
        selectedBibRecordId: { $set: bibRecordId },
        selectedBibAgencyId: { $set: agencyId }
      });
    default:
      return state;
  }
}
