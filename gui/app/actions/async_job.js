export const REQUEST_SUBSCRIBE = "Requesting subscription";
export const SUBSCRIBE = "Subscribing";
export const REQUEST_UNSUBSCRIBE = "Requesting unsubscription";
export const UNSUBSCRIBE = "Unsubscribing";
export const REQUEST_ASYNC_JOB_LIST = "Get async jobs";
export const RECEIVED_ASYNC_JOB_LIST = "Received async job list";
export const APPEND_LOG = "Appending log";
export const REQUEST_FULL_LOG = "Getting full log";
export const RECEIVED_FULL_LOG = "Received full log";
export const JOB_STARTED = "Job started";
export const JOB_FINISHED = "Job finished";
export const WEBSOCKET_ERROR = "Websocket connection error";
export const ASYNC_JOB_ERROR = "Async job had an error";
export const ENQUEUE_ALL_JOB = "Enqueuing all elements on queue";
export const ASYNC_JOB_ERROR_WITH_PATTERN =
  "Queueing elements following pattern";
export const ASYNC_JOB_FINISHED_JOB_SORT = "Changing sort by in finished jobs";
export const ASYNC_JOB_FINISHED_JOB_SORT_BY_STARTED =
  "Changing sort by started in finished jobs";
export const ASYNC_JOB_FINISHED_JOB_SORT_BY_EARLIEST =
  "Changing sort by earliest in finished jobs";

export const requestSubscribe = uuid => ({
  type: REQUEST_SUBSCRIBE,
  uuid
});

export const subscribe = uuid => ({
  type: SUBSCRIBE,
  uuid
});

export const requestUnsubscribe = uuid => ({
  type: REQUEST_UNSUBSCRIBE,
  uuid
});

export const unsubscribe = uuid => ({
  type: UNSUBSCRIBE,
  uuid
});

export const requestAsyncJobList = () => ({
  type: REQUEST_ASYNC_JOB_LIST
});

export const receivedAsyncJobList = jobList => ({
  type: RECEIVED_ASYNC_JOB_LIST,
  jobList
});

export const appendLog = (uuid, logLine) => ({
  type: APPEND_LOG,
  uuid,
  logLine
});

export const requestFullLog = uuid => ({
  type: REQUEST_FULL_LOG,
  uuid
});

export const receivedFullLog = log => ({
  type: RECEIVED_FULL_LOG,
  log
});

export const jobStarted = (uuid, job) => ({
  type: JOB_STARTED,
  uuid,
  job
});

export const jobFinished = (uuid, job) => ({
  type: JOB_FINISHED,
  uuid,
  job
});

//export const websocketError = exception => ({
export const websocketError = () => ({
  type: WEBSOCKET_ERROR
  //message: exception.message
});

// TODO figure out if we can do it on uuid level
export const asyncJobError = exception => ({
  type: ASYNC_JOB_ERROR,
  message: exception.message
});

export const enqueueAllJob = (queue, includeDeleted) => ({
  type: ENQUEUE_ALL_JOB,
  queue,
  includeDeleted
});

export const queueErrorsWithPattern = (path, pattern, consumer) => ({
  type: ASYNC_JOB_ERROR_WITH_PATTERN,
  path,
  pattern,
  consumer
});

export const sortByFinishedJobs = (sortByStarted, sortByEarliest) => ({
  type: ASYNC_JOB_FINISHED_JOB_SORT,
  sortByStarted,
  sortByEarliest
});

export const sortByStartedFinishedJobs = sortByStarted => ({
  type: ASYNC_JOB_FINISHED_JOB_SORT_BY_STARTED,
  sortByStarted
});

export const sortByEarliestFinishedJobs = sortByEarliest => ({
  type: ASYNC_JOB_FINISHED_JOB_SORT_BY_EARLIEST,
  sortByEarliest
});
