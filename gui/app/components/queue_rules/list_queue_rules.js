import React from "react";
import { connect } from "react-redux";

const ListQueueRules = ({ queueRules }) => {
  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Queue rules</th>
        </tr>
      </thead>
      <tbody>
        {queueRules.map(rule => (
          <tr key={rule.queue}>
            <th scope="row">{rule.queue}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const mapStateToProps = state => ({
  queueRules: state.queues.queueRules
});

export default connect(mapStateToProps)(ListQueueRules);
