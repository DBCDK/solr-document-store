import React from "react";
import { connect } from "react-redux";
import { deleteQueueRule } from "../../actions/queues";

const QueueRuleListItem = ({ queueRule, deleteQueue, disabled }) => {
  let tdClassName = disabled ? " table-secondary" : "";
  return (
    <tr key={queueRule.queue} className={"queue-rule-row" + tdClassName}>
      <td scope="row" valign="bottom">
        {queueRule.queue}
        <i
          className="fa fa-trash"
          style={{ float: "right", padding: "1em", cursor: "pointer" }}
          onClick={deleteQueue}
          aria-hidden="true"
        />
      </td>
    </tr>
  );
};

const mapStateToProps = state => ({
  disabled: state.queues.deletionQueueRulePending
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDeletion: () => dispatch(deleteQueueRule(ownProps.queueRule))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps,
  deleteQueue: () =>
    stateProps.disabled ? null : dispatchProps.dispatchDeletion()
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  QueueRuleListItem
);
