
ALTER TABLE bibliographicSolrKeys
  ADD COLUMN classifier VARCHAR(16) NOT NULL DEFAULT '';

ALTER TABLE bibliographicSolrKeys
  ALTER COLUMN classifier DROP DEFAULT;

ALTER TABLE bibliographicSolrKeys
  DROP CONSTRAINT bibliographicSolrKeys_pkey;

ALTER TABLE bibliographicSolrKeys
  ADD CONSTRAINT bibliographicSolrKeys_pkey
  PRIMARY KEY ( agencyId, classifier, bibliographicRecordId );
