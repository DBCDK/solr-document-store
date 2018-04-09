import React from "react";
import { connect } from "react-redux";
import QueueRuleListItem from "./queue_rule_list_item";
import { Table } from "reactstrap";

const ListQueueRules = ({ queueRules }) => {
  return (
    <Table>
      <thead className="thead-dark">
        <tr>
          <th scope="col">Kø-liste</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(queueRules.values()).map(rule => (
          <QueueRuleListItem key={rule.queue} queueRule={rule} />
        ))}
      </tbody>
    </Table>
  );
};

const mapStateToProps = state => ({
  queueRules: state.queues.queueRules
});

export default connect(mapStateToProps)(ListQueueRules);
