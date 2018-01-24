import React from "react";
import QueueRules from "./queue_rules";

class QueueAdminGUI extends React.PureComponent {
  render() {
    return (
      <div className="container pt-4">
        <h1>Queue admin tool</h1>
        <QueueRules />
      </div>
    );
  }
}

export default QueueAdminGUI;
