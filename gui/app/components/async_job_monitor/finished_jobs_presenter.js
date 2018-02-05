import React from "react";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";

const listFinishedJob = job => (
  <div key={"fin-job-" + job.uuid}>{`${job.uuid} - ${job.name}`}</div>
);

const FinishedJobsPresenter = ({ jobs }) => {
  return jobs.length > 0 ? (
    [
      <h2 key="fin-jobs-header">Afsluttede Jobs</h2>,
      ...jobs.map(j => listFinishedJob(j))
    ]
  ) : (
    <EmptyJobListPlaceholder key="empty-jobs" type="afsluttede jobs" />
  );
};

export default FinishedJobsPresenter;
