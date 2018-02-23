import React from "react";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";

const listFinishedJob = finishedJobEntry => (
  <div className="border-bottom" key={"fin-job-" + finishedJobEntry.uuid}>
    <a
      href={"/api/async-job/log/" + finishedJobEntry.uuid}
      target="_blank"
      style={{ cursor: "pointer" }}
    >{`${finishedJobEntry.uuid} - ${finishedJobEntry.job.name}`}</a>
  </div>
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
