import React from "react";
import { connect } from "react-redux";
import { requestSubscribe } from "../../actions/async_job";

const listExtraJob = (job, subscribe) => (
  <div onClick={() => subscribe(job.uuid)} style={{ cursor: "pointer" }}>{`${
    job.uuid
  } - ${job.name}`}</div>
);

const ExtraordinaryRunningJobPresenter = ({ jobs, subscribe }) => {
  return [
    <h2>Igangværende jobs</h2>,
    ...jobs.map(j => listExtraJob(j, subscribe))
  ];
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  subscribe: uuid => dispatch(requestSubscribe(uuid))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ExtraordinaryRunningJobPresenter
);
