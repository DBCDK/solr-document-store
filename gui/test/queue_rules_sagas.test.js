import * as queueActions from "../app/actions/queues";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/admin_queue_root_reducer";
import ourSaga from "../app/sagas/admin_queue_sagas";

let queues = [{ queue: "q1" }, { queue: "q2" }, { queue: "q3" }];

describe("Queue saga integration test", () => {
  let sagaTester;
  // Set up new Redux store for each test
  beforeEach(async () => {
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    // Set up initial data
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
  });
  test("Pulling queue rules success", async () => {
    let desiredQueueRules = new Map();
    queues.forEach(q => desiredQueueRules.set(q.queue, q));
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueueRules);
  });
  test("Pulling queue rules fails", async () => {
    let errorMessage = "We had an error!";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_FAILURE, true);
    expect(sagaTester.getState().queues.queueRulesErrorMessage).toEqual(
      errorMessage
    );
  });
  test("Creating queue rule", async () => {
    let queueName = "I am alive!";
    let createdQueue = { queue: queueName };
    fetch.mockResponse(JSON.stringify(createdQueue));
    sagaTester.dispatch(queueActions.createQueueRule(queueName));
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_SUCCESS, true);
    let desiredQueues = new Map();
    queues.forEach(q => desiredQueues.set(q.queue, q));
    desiredQueues.set(createdQueue.queue, createdQueue);
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueues);
  });
  test("Creating queue rule modified return value", async () => {
    let queueName = "I am alive!";
    let modifiedQueueName = "I am still alive!";
    let createdQueue = { queue: modifiedQueueName };
    fetch.mockResponse(JSON.stringify(createdQueue));
    sagaTester.dispatch(queueActions.createQueueRule(queueName));
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_SUCCESS, true);
    let desiredQueues = new Map();
    queues.forEach(q => desiredQueues.set(q.queue, q));
    desiredQueues.set(createdQueue.queue, createdQueue);
    //desiredQueues.push(createdQueue);
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueues);
  });
  test("Creating queue rule failed", async () => {
    let errorMessage = "We had an error!";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(queueActions.createQueueRule("Oh no!"));
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_FAILED, true);
    expect(sagaTester.getState().queues.addQueueRuleErrorMessage).toEqual(
      errorMessage
    );
  });
  test("Deleting queue rule", async () => {
    let queueName = "q1";
    let deletedQueue = { queue: queueName };
    fetch.mockResponse(JSON.stringify(deletedQueue));
    sagaTester.dispatch(queueActions.deleteQueueRule(queueName));
    await sagaTester.waitFor(queueActions.DELETE_QUEUE_RULE_SUCCESS, true);
    //let desiredQueues = Array.from(queues);
    let desiredQueues = new Map();
    queues.forEach(q => desiredQueues.set(q.queue, q));
    desiredQueues.delete(deletedQueue);
    desiredQueues.delete(deletedQueue.queue);
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueues);
  });
  test("Deleting queue rule with invalid input", async () => {
    let queueName = "invalid";
    let deletedQueue = { queue: queueName };
    fetch.mockResponse(JSON.stringify(deletedQueue));
    sagaTester.dispatch(queueActions.deleteQueueRule(queueName));
    await sagaTester.waitFor(queueActions.DELETE_QUEUE_RULE_SUCCESS, true);
    // Nothing is changed
    let desiredQueues = new Map();
    queues.forEach(q => desiredQueues.set(q.queue, q));
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueues);
  });
  test("Deleting queue rule failed", async () => {
    let errorMessage = "We had an error!";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(queueActions.deleteQueueRule("Oh no!"));
    await sagaTester.waitFor(queueActions.DELETE_QUEUE_RULE_FAILED, true);
    expect(sagaTester.getState().queues.deleteQueueRuleErrorMessage).toEqual(
      errorMessage
    );
  });
});
