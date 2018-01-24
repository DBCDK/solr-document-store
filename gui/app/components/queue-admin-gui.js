import React from "react";
import ListQueueRules from "./list_queue_rules";

class QueueAdminGUI extends React.PureComponent {
  render() {
    return (
      <div className="container pt-4">
        <h1>Queue admin tool</h1>
        <ListQueueRules />
      </div>
    );
  }
}

export default QueueAdminGUI;
