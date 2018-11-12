export const PULL_RELATED_RESOURCES_SUCCESS = "PULL_RELATED_RESOURCES_SUCCESS";
export const PULL_RELATED_RESOURCES_FAILED = "PULL_RELATED_RESOURCES_FAILED";

export const pullSuccess = result => ({
  type: PULL_RELATED_RESOURCES_SUCCESS,
  result
});

export const pullFailed = exception => ({
  type: PULL_RELATED_RESOURCES_FAILED,
  message: exception.message
});
