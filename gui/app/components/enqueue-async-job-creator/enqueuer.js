import React from "react";
import { connect } from "react-redux";
import { queueErrorsWithPattern } from "../../actions/async_job";
import { Button, Input } from "reactstrap";

class EnqueueAsyncJob extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      patternInput: "",
      consumerInput: ""
    };
    this.enqueue = this.enqueue.bind(this);
  }

  render() {
    let { name, placeholder, consumer, path } = this.props;
    return (
      <div className="p-2">
        <h5>{name}</h5>
        <div className="d-flex">
          <Input
            placeholder={placeholder}
            style={{ width: "15vw" }}
            value={this.state.patternInput}
            onChange={e => this.setState({ patternInput: e.target.value })}
          />
          <Input
            placeholder={consumer}
            style={{ width: "15vw" }}
            value={this.state.consumerInput}
            onChange={e => this.setState({ consumerInput: e.target.value })}
          />
          <Button color="primary" className="ml-3" onClick={this.enqueue}>
            Start job
          </Button>
        </div>
      </div>
    );
  }

  enqueue() {
    let { patternInput, consumerInput } = this.state;
    this.props.enqueue(patternInput, consumerInput, this.props.path);
    this.setState({
      patternInput: "",
      consumerInput: ""
    });
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  enqueue: (queue, consumer, path) =>
    dispatch(queueErrorsWithPattern(path, queue, consumer))
});

export default connect(mapStateToProps, mapDispatchToProps)(EnqueueAsyncJob);
