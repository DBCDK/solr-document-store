import React from "react";
import ListQueueRules from "./list_queue_rules";
import AddQueueRule from "./add_queue_rule";

class QueueAdminGUI extends React.PureComponent {
  render() {
    return (
      <div className="container pt-4">
        <h1>Queue admin tool</h1>
        <ListQueueRules />
        <AddQueueRule />
      </div>
    );
  }
}

export default QueueAdminGUI;
