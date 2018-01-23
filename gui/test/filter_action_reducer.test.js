import * as actions from "../app/actions/filtering";
import { SELECT_BIB_RECORD, selectBibRecord } from "../app/actions/global";
import filterReducer, { produceInitialState } from "../app/reducers/filter";

describe("Filtering actions", () => {
  test("Select bibliographic record action", () => {
    let item = { id: ["gj5j3jg"], "term.isbn": ["1234", "5678"] };
    let desiredAction = {
      type: SELECT_BIB_RECORD,
      item
    };
    expect(selectBibRecord(item)).toEqual(desiredAction);
  });
  test("Select white list pending action", () => {
    let whiteListedItem = { id: true, "term.isbn": true };
    let desiredAction = {
      type: actions.WHITE_LIST_SELECT_PENDING,
      whiteListedItem
    };
    expect(actions.selectWhiteListPending(whiteListedItem)).toEqual(
      desiredAction
    );
  });
  test("Select apply filter action", () => {
    let desiredAction = {
      type: actions.CONFIRM_WHITE_LIST
    };
    expect(actions.applyFilter()).toEqual(desiredAction);
  });
  test("Select remove filter action", () => {
    let desiredAction = {
      type: actions.CLEAR_WHITE_LIST
    };
    expect(actions.clearFilter()).toEqual(desiredAction);
  });
});

describe("Filter reducer", () => {
  test("Should return initial state", () => {
    expect(filterReducer(undefined, {})).toEqual(produceInitialState());
  });
  test("Invalid action does nothing", () => {
    expect(filterReducer(produceInitialState(), undefined)).toEqual(
      produceInitialState()
    );
  });
  test("Reducer purity", () => {
    let state = {
      selectedItem: {},
      whiteListPending: {},
      whiteListedElements: null
    };
    let action = {
      type: SELECT_BIB_RECORD,
      item: { indexKeys: { id: ["123"] } }
    };
    let newState = filterReducer(state, action);
    expect(newState).not.toBe(state);
    expect(newState).not.toEqual(state);
  });
  test("Should handle select bibliographic record", () => {
    let item = { indexKeys: { id: ["123"] } };
    let wle = {
      id: true
    };
    let state = {
      selectedItem: {},
      whiteListPending: {},
      whiteListedElements: wle
    };
    let action = {
      type: SELECT_BIB_RECORD,
      item
    };
    expect(filterReducer(state, action)).toEqual({
      selectedItem: item.indexKeys,
      whiteListPending: {},
      whiteListedElements: wle
    });
  });
  test("Should handle selecting an item without index keys", () => {
    let item = { id: ["123"] };
    let state = {
      selectedItem: {},
      whiteListPending: {},
      whiteListedElements: null
    };
    let action = {
      type: SELECT_BIB_RECORD,
      item
    };
    expect(filterReducer(state, action)).toEqual({
      selectedItem: {},
      whiteListPending: {},
      whiteListedElements: null
    });
  });
  test("Should handle white list pending", () => {
    let whiteListedItem = {
      id: true,
      submitter: false,
      original_format: true,
      term: {
        isbn: true,
        acSource: false,
        category: true,
        date: true
      },
      new_fields: {
        bob: true,
        bib: false
      }
    };
    let wle = {
      id: true
    };
    let state = {
      selectedItem: {},
      whiteListPending: {
        id: true,
        submitter: true,
        log: false,
        term: {
          isbn: false,
          acSource: false,
          // "category": true
          date: true,
          mainTitle: true
        },
        existing_fields: {
          boi: false,
          moi: true
        }
      },
      whiteListedElements: wle
    };
    let action = {
      type: actions.WHITE_LIST_SELECT_PENDING,
      whiteListedItem
    };
    expect(filterReducer(state, action)).toEqual({
      selectedItem: {},
      whiteListPending: {
        // unchanged
        id: true,
        // changed
        submitter: false,
        // merged in from update
        original_format: true,
        // merged in from state
        log: false,
        term: {
          // updated
          isbn: true,
          // unchanged
          acSource: false,
          // Only in update, merged in
          category: true,
          // unchanged
          date: true,
          // only in state, merged in
          mainTitle: true
        },
        // merged in from state
        existing_fields: {
          boi: false,
          moi: true
        },
        // merged in from update
        new_fields: {
          bob: true,
          bib: false
        }
      },
      whiteListedElements: wle
    });
  });
  test("Should handle confirm white list", () => {
    let filter = {
      id: true,
      submitter: false,
      original_format: true,
      log: false,
      term: {
        isbn: true,
        acSource: false,
        category: true,
        date: true,
        mainTitle: true
      },
      existing_fields: {
        boi: false,
        moi: true
      },
      new_fields: {
        bob: true,
        bib: false
      }
    };
    let state = {
      selectedItem: {},
      whiteListPending: filter,
      whiteListedElements: { id: false }
    };
    let action = {
      type: actions.CONFIRM_WHITE_LIST
    };
    expect(filterReducer(state, action)).toEqual({
      selectedItem: {},
      whiteListPending: {},
      whiteListedElements: filter
    });
  });
  test("Should handle clear white list", () => {
    let state = {
      selectedItem: {},
      whiteListPending: { id: true },
      whiteListedElements: { id: false }
    };
    let action = {
      type: actions.CLEAR_WHITE_LIST
    };
    expect(filterReducer(state, action)).toEqual({
      selectedItem: {},
      whiteListPending: { id: true },
      whiteListedElements: null
    });
  });
});
