import React from "react";
import { connect } from "react-redux";
import { enqueueJob } from "../../actions/async_job";

class EnqueueAsyncJob extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      parameter1input: "",
      parameter2input: ""
    };
    this.enqueue = this.enqueue.bind(this);
  }

  render() {
    let { name, parameter1, parameter2, path } = this.props;
    return (
      <div className="p-2">
        <h5>{name}</h5>
        <input
          placeholder={parameter1}
          value={this.state.parameter1input}
          onChange={e => this.setState({ parameter1input: e.target.value })}
        />
        <input
          placeholder={parameter2}
          value={this.state.parameter2input}
          onChange={e => this.setState({ parameter2input: e.target.value })}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.enqueue}
        >
          Kør
        </button>
      </div>
    );
  }

  enqueue() {
    let { parameter1input, parameter2input } = this.state;
    this.props.enqueue(parameter1input, parameter2input, this.props.path);
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  enqueue: (param1, param2, path) => dispatch(enqueueJob(param1, param2, path))
});

export default connect(mapStateToProps, mapDispatchToProps)(EnqueueAsyncJob);
