import React from "react";
import QueueRules from "./queue_rules";
import AsyncJobMonitor from "./async_job_monitor";
import EnqueueAsyncJobCreator from "./enqueue-async-job-creator";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Navbar,
  NavbarBrand,
  Collapse
} from "reactstrap";

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
      .then(json => this.setState({ systemName: json.systemName.replace(/^\w/, c => c.toUpperCase()) }))
      .catch(e => {});
  }

  render() {
    document.title = document.title + " " + this.state.systemName;

    return (
      <div>
        <Navbar color="dark" light expand="md">
          <NavbarBrand href="/queue-admin.html" className="text-light">
            Solr DocStore Kø-værktøj
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/" className="text-light">
                  Søge-værktøj
                </NavLink>
              </NavItem>
              <NavItem className="text-light mx-4 my-2">
                {this.state.systemName}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
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
