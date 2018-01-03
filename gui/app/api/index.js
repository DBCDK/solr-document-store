let parse = res => {
  if (res.status === 200) return res.json();
  else if (res.status === 400)
    throw new Error(
      'Input error, server failed to URL decode bibliographicRecordId'
    );
  else throw new Error('Error with http status code: ' + res.status);
};

export default {
  fetchBibliographicPost(searchTerm,{parameter,page = 1,pageSize = 10,orderBy}) {
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
    let queryParams = '?page='+page+'&page_size='+pageSize;
    if(orderBy){
      queryParams += '&order_by='+orderBy.id+'&desc='+orderBy.desc;
    }
    return fetch(
      'api/getBibliographicRecords/'+urlParam+'/' + encodeURIComponent(searchTerm) + queryParams
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
