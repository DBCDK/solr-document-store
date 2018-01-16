export const SEARCH_BIB_RECORD_ID = "SEARCH_BIB_RECORD_ID";
export const SEARCH_FAILED = "SEARCH_FAILED";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_SELECT_PARAMETER = "SEARCH_SELECT_PARAMETER";
export const SEARCH_FETCH_PAGE = "SEARCH_FETCH_PAGE";
export const SEARCH_PAGE_SIZE = "SEARCH_PAGE_SIZE";

export const searchSuccess = bibPosts => ({
  type: SEARCH_SUCCESS,
  bibPosts
});

export const searchFailed = exception => ({
  type: SEARCH_FAILED,
  message: exception.message
});

export const searchBibRecord = searchTerm => ({
  type: SEARCH_BIB_RECORD_ID,
  searchTerm
});

export const fetchPage = (pageIndex, orderBy) => ({
  type: SEARCH_FETCH_PAGE,
  pageIndex,
  orderBy
});

export const setPageSize = pageSize => ({
  type: SEARCH_PAGE_SIZE,
  pageSize
});

export const selectSearchParameter = parameter => ({
  type: SEARCH_SELECT_PARAMETER,
  parameter
});
