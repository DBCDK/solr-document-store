import React from "react";
import QueueRules from "./queue_rules";
import AsyncJobMonitor from "./async_job_monitor";
import EnqueueAsyncJobCreator from "./enqueue-async-job-creator";

class QueueAdminGUI extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      systemName: ""
    };
  }

  componentDidMount() {
    // Small script to figure out what system we are running on, since this is a
    // pretty simple procedure we skip the whole redux thing
    fetch("/api/status/system")
      .then(res => res.json())
      .then(json => this.setState({ systemName: json.systemName }))
      .catch(e => {});
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <h3 className="navbar-brand text-light">
            solr-document-store Kø-værktøj
          </h3>
          <h4 className="text-light mx-4">{this.state.systemName}</h4>
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
