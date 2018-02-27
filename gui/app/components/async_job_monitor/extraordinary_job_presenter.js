import React from "react";
import { connect } from "react-redux";
import { requestSubscribe } from "../../actions/async_job";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";
import DisplayJob from "./display_job";

const ExtraordinaryRunningJobPresenter = ({ jobs, subscribe }) => {
  return jobs.length > 0 ? (
    [
      <h2 key="ex-jobs-header">Igangværende jobs</h2>,
      ...jobs.map(j => (
        <DisplayJob uuid={j.uuid} {...j.job} key={`fin-job-${j.uuid}`} />
      ))
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
