export const PULL_QUEUE_RULES = "Pulling queue rules...";
export const PULL_QUEUE_RULES_SUCCESS = "Queue rules successfully pulled!";
export const PULL_QUEUE_RULES_FAILURE = "Queue rules failed to be pulled...";

export const pullQueueRules = () => ({
  type: PULL_QUEUE_RULES
});

export const pullQueueRulesSuccess = queueRules => ({
  type: PULL_QUEUE_RULES_SUCCESS,
  queueRules
});

export const pullQueueRulesFailed = exception => ({
  type: PULL_QUEUE_RULES_FAILURE,
  message: exception.message
});
