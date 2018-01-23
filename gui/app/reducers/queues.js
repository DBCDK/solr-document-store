import { PULL_QUEUE_RULES, PULL_QUEUE_RULES_SUCCESS } from "../actions/queues";
import update from "immutability-helper";

export const produceInitialState = () => ({
  initiallyLoadedQueueRules: false,
  loadingQueueRules: false,
  queueRules: []
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
        queueRules: { $set: action.queueRules }
      });
    default:
      return state;
  }
}
