import React from "react";

const listFinishedJob = job => <div>{`${job.uuid} - ${job.name}`}</div>;

const FinishedJobsPresenter = ({ jobs }) => {
  return [<h2>Afsluttede Jobs</h2>, ...jobs.map(j => listFinishedJob(j))];
};

export default FinishedJobsPresenter;
