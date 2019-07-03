CREATE TABLE resource (
  agencyId NUMERIC(6) NOT NULL,
  bibliographicRecordId TEXT NOT NULL,
  field VARCHAR(256) NOT NULL,
  value BOOLEAN DEFAULT FALSE,

  PRIMARY KEY (agencyId, bibliographicRecordId, field)
);

CREATE INDEX resource_lookup_fields
    ON resource (agencyId, bibliographicRecordId);