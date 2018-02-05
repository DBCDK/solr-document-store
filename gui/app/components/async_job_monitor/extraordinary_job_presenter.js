import React from "react";
import { connect } from "react-redux";
import { requestSubscribe } from "../../actions/async_job";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";

const listExtraJob = (job, subscribe) => (
  <div
    key={"ex-job-" + job.uuid}
    onClick={() => subscribe(job.uuid)}
    style={{ cursor: "pointer" }}
  >{`${job.uuid} - ${job.name}`}</div>
);

const ExtraordinaryRunningJobPresenter = ({ jobs, subscribe }) => {
  return jobs.length > 0 ? (
    [
      <h2 key="ex-jobs-header">Igangværende jobs</h2>,
      ...jobs.map(j => listExtraJob(j, subscribe))
    ]
  ) : (
    <EmptyJobListPlaceholder key="empty-jobs" type="kørende jobs" />
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  subscribe: uuid => dispatch(requestSubscribe(uuid))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ExtraordinaryRunningJobPresenter
);
