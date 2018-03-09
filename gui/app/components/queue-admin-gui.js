import React from "react";
import QueueRules from "./queue_rules";
import AsyncJobMonitor from "./async_job_monitor";
import EnqueueAsyncJobCreator from "./enqueue-async-job-creator";

class QueueAdminGUI extends React.PureComponent {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <h3 className="navbar-brand text-light">
            solr-document-store Kø-værktøj
          </h3>
          <a className="nav-link text-light" href="/">
            Søge værktøj
          </a>
        </nav>
        <div className="container-full p-5">
          <div className="row">
            <div className="col-6">
              <QueueRules />
              <EnqueueAsyncJobCreator />
            </div>
            <div className="col-6">
              <AsyncJobMonitor />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QueueAdminGUI;
