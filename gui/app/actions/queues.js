export const PULL_QUEUE_RULES = "Pulling queue rules...";
export const PULL_QUEUE_RULES_SUCCESS = "Queue rules successfully pulled!";
export const PULL_QUEUE_RULES_FAILURE = "Queue rules failed to be pulled...";
export const CREATE_QUEUE_RULE = "Creating queue rule...";
export const CREATE_QUEUE_RULE_SUCCESS = "Creating queue rule succeeded!";
export const CREATE_QUEUE_RULE_FAILED = "Creating queue rule failed!";
export const DELETE_QUEUE_RULE = "Deleting queue rule...";
export const DELETE_QUEUE_RULE_SUCCESS = "Deleting queue rule succeeded!";
export const DELETE_QUEUE_RULE_FAILED = "Deleting queue rule failed";

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

export const createQueueRule = queue => ({
  type: CREATE_QUEUE_RULE,
  queueRule: {
    queue: queue
  }
});

export const createQueueRuleSuccess = queueRule => ({
  type: CREATE_QUEUE_RULE_SUCCESS,
  queueRule
});

export const createQueueRuleFailed = () => ({
  type: CREATE_QUEUE_RULE_FAILED
});

export const deleteQueueRule = queueRule => ({
  type: DELETE_QUEUE_RULE,
  queueRule
});

export const deleteQueueRuleSuccess = () => ({
  type: DELETE_QUEUE_RULE_SUCCESS
});

export const deleteQueueRuleFailed = () => ({
  type: DELETE_QUEUE_RULE_FAILED
});
