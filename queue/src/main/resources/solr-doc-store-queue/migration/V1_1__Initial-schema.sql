CREATE TABLE queue (
    agencyId NUMERIC(6) NOT NULL,
    bibliographicRecordId TEXT NOT NULL,
    commitWithin BIGINT
);

CREATE TABLE queue_error(
    agencyId NUMERIC(6) NOT NULL,
    bibliographicRecordId TEXT NOT NULL,
    commitWithin BIGINT
);
