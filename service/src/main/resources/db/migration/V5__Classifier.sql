
ALTER TABLE bibliographicSolrKeys
  DROP CONSTRAINT bibliographicSolrKeys_pkey;
ALTER TABLE bibliographicSolrKeys
  ADD COLUMN classifier VARCHAR(16);

UPDATE bibliographicSolrKeys SET classifier=indexkeys#>>'{original_format,0}';
UPDATE bibliographicSolrKeys SET classifier='UNKNOWN' WHERE classifier IS NULL;

ALTER TABLE bibliographicSolrKeys
  ALTER COLUMN classifier SET NOT NULL;

ALTER TABLE bibliographicSolrKeys
  ADD CONSTRAINT bibliographicSolrKeys_pkey PRIMARY KEY ( agencyId, classifier, bibliographicRecordId );


