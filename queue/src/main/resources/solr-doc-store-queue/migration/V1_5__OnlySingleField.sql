CREATE INDEX queue_jobid ON queue(jobId);

DROP TRIGGER queue_jobid_trigger ON queue;
DROP TRIGGER queue_error_jobid_trigger ON queue_error;
DROP FUNCTION queue_jobid();

ALTER TABLE queue DROP COLUMN agencyid;
ALTER TABLE queue_error DROP COLUMN agencyid;
ALTER TABLE queue DROP COLUMN classifier;
ALTER TABLE queue_error DROP COLUMN classifier;
ALTER TABLE queue DROP COLUMN bibliographicrecordid;
ALTER TABLE queue_error DROP COLUMN bibliographicrecordid;
