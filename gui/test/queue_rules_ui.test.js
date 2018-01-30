import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/admin_queue_store";
import ConnectedQueueRules from "../app/components/queue_rules";
import * as queueActions from "../app/actions/queues";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/admin_queue_root_reducer";
import ourSaga from "../app/sagas/admin_queue_sagas";
import AddQueueRule from "../app/components/queue_rules/add_queue_rule";

Enzyme.configure({ adapter: new Adapter() });

let queues = [{ queue: "q1" }, { queue: "q2" }, { queue: "q3" }];

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <div>
        <ConnectedQueueRules />
      </div>
    </Provider>
  );

describe("QueueRules interactions properly updates global state", () => {
  let store;
  let sagaTester;
  let wrapper;
  // Set up new Redux store for each test
  beforeEach(() => {
    store = configureStore();
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Display loaded queue rules on successful pull", async () => {
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
    wrapper.update();
    let rows = wrapper.find(".queue-rule-row");
    expect(rows).toHaveProperty("length", 3);
  });
  test("Display error on queue rules pulled failed", async () => {
    let errorMessage = "Error! Error!";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_FAILURE, true);
    wrapper.update();
    expect(wrapper.text()).toContain(errorMessage);
  });
  test("Display added queue rule", async () => {
    // Setup initial data
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
    // Input creation setup
    let getAddQueueRuleComponent = () => wrapper.find(AddQueueRule);
    let toggleButton = wrapper.find("button");
    let queueName = "queue1";
    let createdQueueRule = { queue: "queue1" };
    // Toggle create input
    toggleButton.simulate("click");
    wrapper.update();
    fetch.mockResponse(JSON.stringify(createdQueueRule));
    // Typing in queue rule parameters
    let addQueueRuleComponent = getAddQueueRuleComponent();
    let input = addQueueRuleComponent.find("input");
    input.simulate("change", { target: { value: queueName } });
    // Click submit button
    let submitButton = wrapper.findWhere(
      c => c.key() === "add_queue_rule_add_button"
    );
    submitButton.simulate("click");
    // Verify create happens
    await sagaTester.waitFor(queueActions.CREATE_QUEUE_RULE_SUCCESS, true);
    wrapper.update();
    //let desiredQueueRules = Array.from(queues);
    let desiredQueueRules = new Map();
    queues.forEach(q => desiredQueueRules.set(q.queue, q));
    desiredQueueRules.set(createdQueueRule.queue, createdQueueRule);
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueueRules);
    // Verify change is shown
    let rows = wrapper.find(".queue-rule-row");
    expect(rows).toHaveProperty("length", 4);
    expect(wrapper.text()).toContain(queueName);
  });
  test("Toggle create field off hides input field", async () => {
    let getAddQueueRuleComponent = () => wrapper.find(AddQueueRule);
    let toggleButton = wrapper.find("button");
    toggleButton.simulate("click");
    expect(getAddQueueRuleComponent().find("input")).toHaveProperty(
      "length",
      1
    );
    wrapper.update();
    let cancelButton = wrapper.findWhere(
      c => c.key() === "add_queue_rule_cancel_button"
    );
    cancelButton.simulate("click");
    expect(getAddQueueRuleComponent().find("input")).toHaveProperty(
      "length",
      0
    );
  });
});
