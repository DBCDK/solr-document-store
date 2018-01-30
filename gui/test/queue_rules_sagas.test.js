import * as queueActions from "../app/actions/queues";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/admin_queue_root_reducer";
import ourSaga from "../app/sagas/admin_queue_sagas";

let queues = [{ queue: "q1" }, { queue: "q2" }, { queue: "q3" }];

describe("Queue saga integration test", () => {
  let sagaTester;
  // Set up new Redux store for each test
  beforeEach(() => {
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
  });
  test("Pulling queue rules success", async () => {
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
    expect(sagaTester.getState().queues.queueRules).toEqual(new Set(queues));
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
    // Set up initial data
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
    // Test creation
    let queueName = "I am alive!";
    let createdQueue = { queue: queueName };
    fetch.mockResponse(JSON.stringify(createdQueue));
    sagaTester.dispatch(queueActions.createQueueRule(queueName));
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_SUCCESS, true);
    //let desiredQueues = Array.from(queues);
    let desiredQueues = new Set(queues);
    //desiredQueues.push(createdQueue);
    desiredQueues.add(createdQueue);
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueues);
  });
  test("Creating queue rule modified return value", async () => {
    // Set up initial data
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
    // Test creation
    let queueName = "I am alive!";
    let modifiedQueueName = "I am still alive!";
    let createdQueue = { queue: modifiedQueueName };
    fetch.mockResponse(JSON.stringify(createdQueue));
    sagaTester.dispatch(queueActions.createQueueRule(queueName));
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_SUCCESS, true);
    //let desiredQueues = Array.from(queues);
    let desiredQueues = new Set(queues);
    desiredQueues.add(createdQueue);
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
});
