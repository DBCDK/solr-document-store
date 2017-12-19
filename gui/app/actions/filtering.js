export const WHITE_LIST_SELECT_PENDING = "WHITE_LIST_SELECT_PENDING";
export const CONFIRM_WHITE_LIST = "CONFIRM_WHITE_LIST";
export const CLEAR_WHITE_LIST = "CLEAR_WHITE_LIST";

export const selectWhiteListPending = whiteListedItem => ({
  type: WHITE_LIST_SELECT_PENDING,
  whiteListedItem
});

export const applyFilter = () => ({
  type: CONFIRM_WHITE_LIST
});

export const clearFilter = () => ({
  type: CLEAR_WHITE_LIST
});
