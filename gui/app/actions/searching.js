export const SEARCH_BIB_RECORD_ID = "SEARCH_BIB_RECORD_ID";
export const SEARCH_FAILED = "SEARCH_FAILED";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_SELECT_PARAMETER = "SEARCH_SELECT_PARAMETER";
export const SEARCH_FETCH_PAGE = "SEARCH_FETCH_PAGE";
export const SEARCH_PAGE_SIZE = "SEARCH_PAGE_SIZE";
export const SEARCH_BIB_ITEM = "Searching specific bibliographic record";
export const SEARCH_BIB_ITEM_SUCCESS =
  "Successfully retrieved specific bibliographic record";
export const SEARCH_BIB_ITEM_FAILED =
  "Failed to retrieve specific bibliographic record";
export const INITIAL_RETRIEVE_BIB_ITEM =
  "Initially retrieving bibliographic record";

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

export const searchBibItem = (
  bibliographicRecordId,
  bibliographicAgencyId
) => ({
  type: SEARCH_BIB_ITEM,
  bibliographicRecordId,
  bibliographicAgencyId
});

export const searchBibItemSuccess = bibItem => ({
  type: SEARCH_BIB_ITEM_SUCCESS,
  bibItem
});

export const searchBibItemFailed = exception => ({
  type: SEARCH_BIB_ITEM_FAILED,
  message: exception.message
});

export const initialRetrieveBibItem = (
  bibliographicRecordId,
  bibliographicAgencyId
) => ({
  type: INITIAL_RETRIEVE_BIB_ITEM,
  bibliographicRecordId,
  bibliographicAgencyId
});
