
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
          ADD COLUMN classifier VARCHAR(16);

        FOR agencyIdTmp, cnt IN SELECT agencyId, COUNT(*) FROM bibliographicSolrKeys GROUP BY agencyId ORDER BY agencyId LOOP
            RAISE NOTICE 'agency=%(%)', agencyIdTmp, cnt;
            FOR classifierTmp, cnt IN SELECT indexkeys#>>'{original_format,0}' AS c, count(*) FROM bibliographicsolrkeys WHERE agencyid=agencyIdTmp AND NOT deleted GROUP BY c ORDER BY c LOOP
                RAISE NOTICE 'agency=%(%), classifier=%', agencyIdTmp, cnt, classifierTmp;
                UPDATE bibliographicSolrKeys SET classifier=classifierTmp WHERE agencyId=agencyIdTmp AND indexkeys#>>'{original_format,0}' = classifierTmp;
            END LOOP;
        END LOOP;

        UPDATE bibliographicSolrKeys SET classifier='UNKNOWN'
          WHERE classifier IS NULL;

        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN classifier SET NOT NULL;

    END IF;
END
$$;

ALTER TABLE bibliographicSolrKeys
  DROP CONSTRAINT bibliographicSolrKeys_pkey;

ALTER TABLE bibliographicSolrKeys
  ADD CONSTRAINT bibliographicSolrKeys_pkey
  PRIMARY KEY ( agencyId, classifier, bibliographicRecordId );
