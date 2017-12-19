let parse = res => {
  if (res.status === 200) return res.json();
  else if (res.status === 400)
    throw new Error(
      'Input error, server failed to URL decode bibliographicRecordId'
    );
  else throw new Error('Error with http status code: ' + res.status);
};

export default {
  fetchBibliographicPost(searchTerm) {
    return fetch(
      'api/getBibliographicRecord/' + encodeURIComponent(searchTerm)
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
