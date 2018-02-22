import React from "react";
import SubscriptionItem from "./subscription_item";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";

const listSubscribedJob = job => (
  <SubscriptionItem
    key={"sub-job-" + job.uuid}
    uuid={job.uuid}
    name={job.name}
    log={job.log}
  />
);

const SubscribedJobsPresenter = ({ jobs }) => {
  return jobs.length > 0 ? (
    [
      <h2 key="sub-jobs-header">Jobs du lytter til</h2>,
      ...jobs.map(j => listSubscribedJob(j))
    ]
  ) : (
    <EmptyJobListPlaceholder key="empty-jobs" type="jobs du lytter til" />
  );
};

export default SubscribedJobsPresenter;
