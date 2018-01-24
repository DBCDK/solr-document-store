import {
  CREATE_QUEUE_RULE,
  CREATE_QUEUE_RULE_FAILED,
  CREATE_QUEUE_RULE_SUCCESS,
  PULL_QUEUE_RULES,
  PULL_QUEUE_RULES_SUCCESS
} from "../actions/queues";
import update from "immutability-helper";

export const produceInitialState = () => ({
  initiallyLoadedQueueRules: false,
  loadingQueueRules: false,
  queueRules: [],
  addQueueRulePending: false,
  addQueueRuleErrorMessage: ""
});

export default function queues(state = produceInitialState(), action = {}) {
  switch (action.type) {
    case PULL_QUEUE_RULES:
      return update(state, {
        loadingQueueRules: { $set: true }
      });
    case PULL_QUEUE_RULES_SUCCESS:
      return update(state, {
        initiallyLoadedQueueRules: { $set: true },
        loadingQueueRules: { $set: false },
        queueRules: { $set: action.queueRules.result }
      });
    case CREATE_QUEUE_RULE:
      return update(state, {
        addQueueRulePending: { $set: true }
      });
    case CREATE_QUEUE_RULE_SUCCESS:
      return update(state, {
        queueRules: { $push: [action.queueRule] },
        addQueueRulePending: { $set: false }
      });
    case CREATE_QUEUE_RULE_FAILED:
      return update(state, {
        addQueueRuleErrorMessage: { $set: action.message },
        addQueueRulePending: { $set: false }
      });
    default:
      return state;
  }
}