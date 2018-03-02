import React from "react";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";
import DisplayJob from "./display_job";

const FinishedJobsPresenter = ({ jobs }) => {
  return jobs.length > 0 ? (
    [
      <h2 key="fin-jobs-header">Afsluttede Jobs</h2>,
      ...jobs.map(j => (
        <DisplayJob uuid={j.uuid} {...j.job} key={`fin-job-${j.uuid}`} />
      ))
    ]
  ) : (
    <EmptyJobListPlaceholder key="empty-jobs" type="afsluttede jobs" />
  );
};

export default FinishedJobsPresenter;
