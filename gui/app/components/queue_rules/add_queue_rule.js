import React from "react";
import { connect } from "react-redux";
import { createQueueRule } from "../../actions/queues";
import { Button } from "reactstrap";

class AddQueueRule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorToggle: false,
      queueRule: ""
    };
    this.toggleQueueRuleEditor = this.toggleQueueRuleEditor.bind(this);
    this.handleSearchTyped = this.handleSearchTyped.bind(this);
    this.cancelEditor = this.cancelEditor.bind(this);
    this.submitQueueRule = this.submitQueueRule.bind(this);
  }

  render() {
    if (this.state.editorToggle) {
      return [
        <input
          placeholder="Queue rule name"
          type="text"
          key="add_queue_rule_input"
          value={this.state.queueRule}
          onChange={this.handleSearchTyped}
        />,
        <Button
          key="add_queue_rule_add_button"
          color="success"
          className="mx-2"
          disabled={this.props.addQueueRulePending}
          onClick={this.submitQueueRule}
        >
          Tilføj
        </Button>,
        <Button
          key="add_queue_rule_cancel_button"
          color="danger"
          className="mx-2"
          disabled={this.props.addQueueRulePending}
          onClick={this.cancelEditor}
        >
          Annullér
        </Button>
      ];
    } else {
      return (
        <Button
          color="success"
          disabled={this.props.addQueueRulePending}
          onClick={this.toggleQueueRuleEditor}
        >
          Tilføj kø og regel
        </Button>
      );
    }
  }

  toggleQueueRuleEditor() {
    this.setState({
      editorToggle: !this.state.editorToggle
    });
  }

  submitQueueRule() {
    this.props.addQueueRule(this.state.queueRule);
  }

  cancelEditor() {
    this.setState({
      editorToggle: false,
      queueRule: ""
    });
  }

  handleSearchTyped(event) {
    const { value } = event.target;
    this.setState({
      queueRule: value
    });
  }
}

const mapStateToProps = state => ({
  addQueueRulePending: state.queues.addQueueRulePending
});

const mapDispatchToProps = dispatch => ({
  addQueueRule: queueRule => dispatch(createQueueRule(queueRule))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddQueueRule);
