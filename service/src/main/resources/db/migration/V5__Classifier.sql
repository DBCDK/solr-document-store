
DO
$$
DECLARE
    hasnt BOOLEAN;
    agencyIdTmp NUMERIC(6);
    cnt NUMERIC(12);
    classifierTmp VARCHAR(16);
BEGIN

    SELECT COUNT(*) = 0 INTO hasnt FROM information_schema.columns WHERE table_name = 'bibliographicsolrkeys' AND column_name = 'classifier';
    IF hasnt THEN
        ALTER TABLE bibliographicSolrKeys
          ADD COLUMN classifier VARCHAR(16) DEFAULT '';
    END IF;
END
$$;

ALTER TABLE bibliographicSolrKeys
  ALTER COLUMN classifier DROP DEFAULT;

ALTER TABLE bibliographicSolrKeys
  DROP CONSTRAINT bibliographicSolrKeys_pkey;

ALTER TABLE bibliographicSolrKeys
  ADD CONSTRAINT bibliographicSolrKeys_pkey
  PRIMARY KEY ( agencyId, classifier, bibliographicRecordId );
