import React from "react";
import { connect } from "react-redux";

const DisplayQueueRuleError = ({
  queueRulesErrorMessage,
  addQueueRuleErrorMessage,
  deleteQueueRuleErrorMessage
}) => {
  if (
    !queueRulesErrorMessage.length > 0 &&
    !addQueueRuleErrorMessage.length > 0 &&
    !deleteQueueRuleErrorMessage.length > 0
  ) {
    return null;
  }
  return (
    <div className="alert alert-danger" role="alert">
      {queueRulesErrorMessage}
      {addQueueRuleErrorMessage}
      {deleteQueueRuleErrorMessage}
    </div>
  );
};

const mapStateToProps = state => ({
  queueRulesErrorMessage: state.queues.queueRulesErrorMessage,
  addQueueRuleErrorMessage: state.queues.addQueueRuleErrorMessage,
  deleteQueueRuleErrorMessage: state.queues.deleteQueueRuleErrorMessage
});

export default connect(mapStateToProps)(DisplayQueueRuleError);
