import React from "react";
import { connect } from "react-redux";
import { deleteQueueRule } from "../../actions/queues";

const QueueRuleListItem = ({ queueRule, deleteQueue }) => {
  return (
    <tr key={queueRule.queue} className="queue-rule-row">
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

const mapStateToProps = state => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteQueue: () => dispatch(deleteQueueRule(ownProps.queueRule))
});

export default connect(mapStateToProps, mapDispatchToProps)(QueueRuleListItem);
