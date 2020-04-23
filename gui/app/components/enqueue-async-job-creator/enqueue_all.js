import React from "react";
import { connect } from "react-redux";
import { enqueueAllJob } from "../../actions/async_job";
import { Button, Input } from "reactstrap";

class EnqueueAllAsyncJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queueInput: "",
      includeDeleted: false
    };
    this.enqueueAll = this.enqueueAll.bind(this);
    this.toggleDeleteIncluded = this.toggleDeleteIncluded.bind(this);
  }

  render() {
    return (
      <div className="py-3">
        <h5>Sæt alle poster i kø</h5>
        <div className="d-flex">
          <Input
            placeholder="Kø-navn"
            style={{ width: "15vw" }}
            value={this.state.queueInput}
            onChange={e => this.setState({ queueInput: e.target.value })}
          />
          <span
            className="px-4"
            style={{ cursor: "pointer" }}
            onClick={this.toggleDeleteIncluded}
          >
            Slettede poster inkluderet:
            <input
              type="checkbox"
              aria-label="Checkbox for following text input"
              checked={this.state.includeDeleted}
              onClick={this.toggleDeleteIncluded}
            />
          </span>
          <Button color="primary" onClick={this.enqueueAll}>
            Start job
          </Button>
        </div>
      </div>
    );
  }

  enqueueAll(e) {
    let { queueInput, includeDeleted } = this.state;
    this.props.enqueueAll(queueInput, includeDeleted);
    this.setState({
      queueInput: "",
      includeDeleted: false
    });
  }

  toggleDeleteIncluded(e) {
    this.setState({
      includeDeleted: !this.state.includeDeleted
    });
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  enqueueAll: (queue, includeDeleted) =>
    dispatch(enqueueAllJob(queue, includeDeleted))
});

export default connect(mapStateToProps, mapDispatchToProps)(EnqueueAllAsyncJob);
