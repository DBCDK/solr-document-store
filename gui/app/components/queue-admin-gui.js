import React from "react";
import QueueRules from "./queue_rules";
import AsyncJobMonitor from "./async_job_monitor";

class QueueAdminGUI extends React.PureComponent {
  render() {
    return (
      <div className="container-full">
        <div className="row">
          <div className="col-6">
            <h1>Queue admin tool</h1>
            <QueueRules />
          </div>
          <div className="col-6">
            <AsyncJobMonitor />
          </div>
        </div>
      </div>
    );
  }
}

export default QueueAdminGUI;
