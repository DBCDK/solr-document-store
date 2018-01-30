import {
  CREATE_QUEUE_RULE,
  CREATE_QUEUE_RULE_FAILED,
  CREATE_QUEUE_RULE_SUCCESS,
  DELETE_QUEUE_RULE,
  DELETE_QUEUE_RULE_FAILED,
  DELETE_QUEUE_RULE_SUCCESS,
  PULL_QUEUE_RULES,
  PULL_QUEUE_RULES_FAILURE,
  PULL_QUEUE_RULES_SUCCESS
} from "../actions/queues";
import update from "immutability-helper";

export const produceInitialState = () => ({
  loadingQueueRules: false,
  queueRules: new Map(),
  queueRulesErrorMessage: "",
  addQueueRulePending: false,
  addQueueRuleErrorMessage: "",
  deletionQueueRulePending: false,
  deleteQueueRuleErrorMessage: ""
});

export default function queues(state = produceInitialState(), action = {}) {
  switch (action.type) {
    case PULL_QUEUE_RULES:
      return update(state, {
        loadingQueueRules: { $set: true }
      });
    case PULL_QUEUE_RULES_SUCCESS:
      let result = new Map();
      action.queueRules.result.forEach(q => result.set(q.queue, q));
      return update(state, {
        loadingQueueRules: { $set: false },
        queueRules: { $set: result }
      });
    case PULL_QUEUE_RULES_FAILURE:
      return update(state, {
        queueRulesErrorMessage: { $set: action.message },
        loadingQueueRules: { $set: false }
      });
    case CREATE_QUEUE_RULE:
      return update(state, {
        addQueueRulePending: { $set: true }
      });
    case CREATE_QUEUE_RULE_SUCCESS:
      return update(state, {
        queueRules: { $add: [[action.queueRule.queue, action.queueRule]] },
        addQueueRulePending: { $set: false }
      });
    case CREATE_QUEUE_RULE_FAILED:
      return update(state, {
        addQueueRuleErrorMessage: { $set: action.message },
        addQueueRulePending: { $set: false }
      });
    case DELETE_QUEUE_RULE:
      return update(state, {
        deletionQueueRulePending: { $set: true }
      });
    case DELETE_QUEUE_RULE_SUCCESS:
      return update(state, {
        deletionQueueRulePending: { $set: false },
        queueRules: { $remove: [action.queueRule.queue] }
      });
    case DELETE_QUEUE_RULE_FAILED:
      return update(state, {
        deletionQueueRulePending: { $set: false },
        deleteQueueRuleErrorMessage: { $set: action.message }
      });
    default:
      return state;
  }
}
