export const SEARCH_BIB_ID = "searchBibId";
export const SEARCH_REPO_ID = "searchRepoId";

let parse = res => {
  if (res.status === 200) return res.json();
  else if (res.status === 400)
    throw new Error(
      "Input error, server failed to URL decode bibliographicRecordId"
    );
  else throw new Error("Error with http status code: " + res.status);
};

export default {
  fetchBibliographicPost(
    searchTerm,
    { parameter, page = 1, pageSize = 10, orderBy }
  ) {
    let urlParam = "";
    switch (parameter) {
      case SEARCH_BIB_ID:
        urlParam = "bibliographic-record-id";
        break;
      case SEARCH_REPO_ID:
        urlParam = "repository-id";
        break;
      default:
        throw new Error("Invalid parameter");
    }
    let queryParams = `?page=${page}&page_size=${pageSize}`;
    if (orderBy) {
      queryParams += `&order_by=${orderBy.id}&desc=${orderBy.desc}`;
    }
    return fetch(
      `api/bibliographic-records/${urlParam}/${encodeURIComponent(
        searchTerm
      )}${queryParams}`
    ).then(parse);
  },
  pullRelatedHoldings(bibliographicRecordId, bibliographicAgencyId) {
    return fetch(
      `api/related-holdings/${encodeURIComponent(
        bibliographicRecordId
      )}/${bibliographicAgencyId}`
    ).then(parse);
  },
  fetchQueueRules() {
    return fetch("api/queue-rules").then(parse);
  },
  createQueueRule(queueRule) {
    return fetch("api/create-queue-rule", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(queueRule)
    }).then(parse);
  },
  deleteQueueRule(queueID) {
    return fetch(`api/queue-rule/${queueID}`, {
      method: "DELETE"
    }).then(parse);
  },
  fetchAsyncJobList() {
    return fetch("api/jobs-status").then(parse);
  },
  fetchFullLog(uuid) {
    return fetch(`api/log/${uuid}`).then(res => res.body);
  }
};
