import React from "react";
import { connect } from "react-redux";
import ExtraordinaryRunningJobsPresenter from "./extraordinary_job_presenter";
import SubscribedJobsPresenter from "./subscribed_jobs_presenter";
import FinishedJobsPresenter from "./finished_jobs_presenter";

const AsyncJobMonitor = ({
  extraordinaryRunningJobs,
  subscribedJobs,
  finishedJobs
}) => {
  return [
    <ExtraordinaryRunningJobsPresenter
      key="ex-jobs"
      jobs={extraordinaryRunningJobs}
    />,
    <SubscribedJobsPresenter key="sub-jobs" jobs={subscribedJobs} />,
    <FinishedJobsPresenter key="fin-jobs" jobs={finishedJobs} />
  ];
};

const mapStateToProps = state => ({
  runningJobs: state.asyncJob.runningJobs,
  finishedJobs: state.asyncJob.finishedJobs,
  subscriptions: state.asyncJob.subscriptions,
  logs: state.asyncJob.logs
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  subscriptions: stateProps.subscriptions,
  extraordinaryRunningJobs: Array.from(stateProps.runningJobs.entries())
    .filter(rj => !stateProps.subscriptions.has(rj[0]))
    .map(rj => ({ uuid: rj[0], name: rj[1] })),
  subscribedJobs: Array.from(stateProps.subscriptions.keys()).map(uuid => ({
    uuid,
    name: stateProps.runningJobs.get(uuid),
    log: stateProps.logs.get(uuid)
  })),
  finishedJobs: stateProps.finishedJobs
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  AsyncJobMonitor
);
