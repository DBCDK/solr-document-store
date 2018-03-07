import React from "react";
import EnqueueAsyncJob from "./enqueuer";
import EnqueueAllAsyncJob from "./enqueue_all";

const EnqueueAsyncJobCreator = ({}) => {
  return (
    <React.Fragment>
      <EnqueueAllAsyncJob
        queue="Queue"
        includeDeleted="Include deleted (Default false)"
      />
      <EnqueueAsyncJob
        name="Udskriv fejlede poster til log"
        placeholder="Pattern"
        consumer="Consumer (Valgfri)"
        path="list-errors"
      />
      <EnqueueAsyncJob
        name="Slet fejlede poster fra fejl-tabel"
        placeholder="Pattern"
        consumer="Consumer (Valgfri)"
        path="delete-errors"
      />
      <EnqueueAsyncJob
        name="Sæt fejlede poster på kø"
        placeholder="Pattern"
        consumer="Consumer (Valgfri)"
        path="requeue-errors"
      />
    </React.Fragment>
  );
};

export default EnqueueAsyncJobCreator;
