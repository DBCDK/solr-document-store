import React from "react";
import { connect } from "react-redux";
import QueueRuleListItem from "./queue_rule_list_item";

const ListQueueRules = ({ queueRules }) => {
  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Kø regler</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(queueRules.values()).map(rule => (
          <QueueRuleListItem key={rule.queue} queueRule={rule} />
        ))}
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  queueRules: state.queues.queueRules
});

export default connect(mapStateToProps)(ListQueueRules);
