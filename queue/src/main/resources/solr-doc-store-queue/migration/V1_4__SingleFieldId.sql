
ALTER TABLE queue
  ADD COLUMN jobid TEXT NOT NULL DEFAULT 'UNSET';

ALTER TABLE queue
  ALTER COLUMN jobid DROP DEFAULT;

UPDATE queue SET jobid = agencyid || '-' || classifier || ':' || bibliographicrecordid;

ALTER TABLE queue_error
  ADD COLUMN jobid TEXT NOT NULL DEFAULT 'UNSET';

ALTER TABLE queue_error
  ALTER COLUMN jobid DROP DEFAULT;

UPDATE queue SET jobid = agencyid || '-' || classifier || ':' || bibliographicrecordid;


-- INSERT TRIGGER: that builds jobid for existing applications, and abc for new
CREATE OR REPLACE FUNCTION queue_jobid() RETURNS TRIGGER LANGUAGE PLPGSQL
AS
$$
BEGIN
  IF NEW.jobid IS NULL THEN
    NEW.jobid = NEW.agencyid || '-' || NEW.classifier || ':' || NEW.bibliographicrecordid;
 ELSE
   NEW.agencyid = SUBSTRING(NEW.jobid FROM '^([0-9]*)')::INTEGER;
   NEW.classifier = SUBSTRING(NEW.jobid FROM '-([^:]*):');
   NEW.bibliographicrecordid = SUBSTRING(NEW.jobid FROM ':(.*)');
  END IF;
  RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS queue_jobid_trigger ON queue;
DROP TRIGGER IF EXISTS queue_error_jobid_trigger ON queue_error;
CREATE TRIGGER queue_jobid_trigger BEFORE INSERT ON queue FOR EACH ROW EXECUTE PROCEDURE queue_jobid();
CREATE TRIGGER queue_error_jobid_trigger BEFORE INSERT ON queue_error FOR EACH ROW EXECUTE PROCEDURE queue_jobid();
