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
import QueueRuleListItem from "../app/components/queue_rules/queue_rule_list_item";

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
  beforeEach(async () => {
    store = configureStore();
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
    // Setup initial data
    fetch.mockResponse(JSON.stringify({ result: queues, pages: 1 }));
    sagaTester.dispatch(queueActions.pullQueueRules());
    await sagaTester.waitFor(queueActions.PULL_QUEUE_RULES_SUCCESS, true);
  });
  test("Display loaded queue rules on successful pull", async () => {
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
  test("Clicking trash-can icon removes corresponding queue", async () => {
    wrapper.update();
    let getQueueRuleListItem = () => wrapper.find(QueueRuleListItem);
    let items = getQueueRuleListItem();
    expect(items).toHaveProperty("length", 3);
    // Picking middle element
    let item = items.at(1);
    let deleteLogo = item.find("i");
    // Executing the delete by clicking delete icon
    fetch.mockResponse(JSON.stringify({ queue: "q2" }));
    deleteLogo.simulate("click");
    await sagaTester.waitFor(queueActions.DELETE_QUEUE_RULE_SUCCESS, true);
    wrapper.update();
    expect(
      getQueueRuleListItem().filterWhere(e => e.html() !== null)
    ).toHaveProperty("length", 2);
    let desiredQueueRules = new Map();
    queues.forEach(q => desiredQueueRules.set(q.queue, q));
    desiredQueueRules.delete("q2");
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueueRules);
  });
  test("Pending deletion disables deletion by clicking delete icon", async () => {
    wrapper.update();
    let getQueueRuleListItem = () => wrapper.find(QueueRuleListItem);
    let items = getQueueRuleListItem();
    let item1 = items.at(1);
    let item2 = items.at(2);
    let deleteLogo1 = item1.find("i");
    let deleteLogo2 = item2.find("i");
    fetch.mockResponses(
      [JSON.stringify({ queue: "q2" })],
      [JSON.stringify({ queue: "q1" })]
    );
    deleteLogo1.simulate("click");
    // Should be disabled
    deleteLogo2.simulate("click");
    await sagaTester.waitFor(queueActions.DELETE_QUEUE_RULE_SUCCESS, true);
    wrapper.update();
    // Still only one element deleted
    expect(
      getQueueRuleListItem().filterWhere(e => e.html() !== null)
    ).toHaveProperty("length", 2);
    let desiredQueueRules = new Map();
    queues.forEach(q => desiredQueueRules.set(q.queue, q));
    // Only first element we tried to delete succeeded
    desiredQueueRules.delete("q2");
    expect(sagaTester.getState().queues.queueRules).toEqual(desiredQueueRules);
  });
});
