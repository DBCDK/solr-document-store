export const PULL_RELATED_HOLDINGS_SUCCESS = 'PULL_RELATED_HOLDINGS_SUCCESS';
export const PULL_RELATED_HOLDINGS_FAILED = 'PULL_RELATED_HOLDINGS_FAILED';

export const pullSuccess = (result) => ({
    type: PULL_RELATED_HOLDINGS_SUCCESS,
    result
});

export const pullFailed = (exception) => ({
    type: PULL_RELATED_HOLDINGS_FAILED,
    message: exception.message
});