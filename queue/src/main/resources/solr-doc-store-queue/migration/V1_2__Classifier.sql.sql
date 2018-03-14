ALTER TABLE queue
  ADD COLUMN classifier TEXT NOT NULL;

ALTER TABLE queue_error
  ADD COLUMN classifier TEXT NOT NULL;
