export const SEARCH_BIB_ID = "searchBibId";
export const SEARCH_REPO_ID = "searchRepoId";

let parse = res => {
  if (res.status === 200) return res.json();
  else if (res.status === 400)
    throw new Error(
      'Input error, server failed to URL decode bibliographicRecordId'
    );
  else throw new Error('Error with http status code: ' + res.status);
};

export default {
  fetchBibliographicPost(searchTerm,parameter) {
    let urlParam = "";
    switch (parameter) {
      case SEARCH_BIB_ID:
        urlParam = "bibliographicRecordId";
        break;
      case SEARCH_REPO_ID:
        urlParam = "repositoryId";
        break;
      default:
        throw new Error("Invalid parameter");
    }
    return fetch(
      'api/getBibliographicRecords/'+urlParam+'/' + encodeURIComponent(searchTerm)
    ).then(parse);
  },
  pullRelatedHoldings(bibliographicRecordId, bibliographicAgencyId) {
    return fetch(
      'api/getRelatedHoldings/' +
        encodeURIComponent(bibliographicRecordId) +
        '/' +
        bibliographicAgencyId
    ).then(parse);
  }
};
