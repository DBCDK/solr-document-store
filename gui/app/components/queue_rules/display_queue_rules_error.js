import React from "react";
import { connect } from "react-redux";

const DisplayQueueRuleError = ({
  queueRulesErrorMessage,
  addQueueRuleErrorMessage
}) => {
  if (
    !queueRulesErrorMessage.length > 0 &&
    !addQueueRuleErrorMessage.length > 0
  ) {
    return null;
  }
  return (
    <div className="alert alert-danger" role="alert">
      {queueRulesErrorMessage}
      {addQueueRuleErrorMessage}
    </div>
  );
};

const mapStateToProps = state => ({
  queueRulesErrorMessage: state.queues.queueRulesErrorMessage,
  addQueueRuleErrorMessage: state.queues.addQueueRuleErrorMessage
});

export default connect(mapStateToProps)(DisplayQueueRuleError);
