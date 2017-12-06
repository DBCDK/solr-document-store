export const PULL_RELATED_HOLDINGS = 'PULL_RELATED_HOLDINGS';
export const PULL_RELATED_HOLDINGS_SUCCESS = 'PULL_RELATED_HOLDINGS_SUCCESS';

export const pullRelatedHoldings = (bibliographicRecordId,bibliographicAgencyId) => ({
    type: PULL_RELATED_HOLDINGS,
    bibliographicRecordId,
    bibliographicAgencyId
});

export const pullSuccess = (result) => ({
    type: PULL_RELATED_HOLDINGS_SUCCESS,
    result
});