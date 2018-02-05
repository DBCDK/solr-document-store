import React from "react";
import SubscriptionItem from "./subscription_item";

const listSubscribedJob = job => (
  <SubscriptionItem uuid={job.uuid} name={job.name} log={job.log} />
);

const SubscribedJobsPresenter = ({ jobs }) => {
  return [<h2>Jobs du lytter til</h2>, ...jobs.map(j => listSubscribedJob(j))];
};

export default SubscribedJobsPresenter;
