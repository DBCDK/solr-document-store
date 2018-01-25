import React from "react";
import ListQueueRules from "./list_queue_rules";
import AddQueueRule from "./add_queue_rule";
import DisplayQueueRulesError from "./display_queue_rules_error";

const QueueRules = ({}) => {
  return [
    <ListQueueRules key="list-queue-rules" />,
    <AddQueueRule key="add-queue-rule" />,
    <DisplayQueueRulesError key="display-queue-rule-error" />
  ];
};

export default QueueRules;
