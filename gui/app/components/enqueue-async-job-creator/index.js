import React from "react";
import EnqueueAsyncJob from "./enqueuer";

const EnqueueAsyncJobCreator = ({}) => {
  return (
    <React.Fragment>
      <EnqueueAsyncJob
        name="Sæt alt i kø"
        parameter1="Queue"
        parameter2="Include deleted (Default false)"
        path="queue-all"
      />
      <EnqueueAsyncJob
        name="Udskriv fejlede poster til log"
        parameter1="Pattern"
        parameter2="Consumer (Valgfri)"
        path="list-errors"
      />
      <EnqueueAsyncJob
        name="Slet fejlede poster fra fejl-tabel"
        parameter1="Pattern"
        parameter2="Consumer (Valgfri)"
        path="delete-errors"
      />
      <EnqueueAsyncJob
        name="Sæt fejlede poster på kø"
        parameter1="Pattern"
        parameter2="Consumer (Valgfri)"
        path="requeue-errors"
      />
    </React.Fragment>
  );
};

export default EnqueueAsyncJobCreator;
