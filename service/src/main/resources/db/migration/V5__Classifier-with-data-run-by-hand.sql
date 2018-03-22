DO
$$
DECLARE
    hasnt BOOLEAN;
BEGIN
    SELECT COUNT(*) = 0 INTO hasnt FROM information_schema.columns WHERE table_name = 'bibliographicsolrkeys' AND column_name = 'classifier';
    IF hasnt THEN

        ALTER TABLE bibliographicSolrKeys
          DROP CONSTRAINT bibliographicSolrKeys_pkey;
        DROP INDEX bibliographicsolrkeysjson;
        ALTER TABLE bibliographicsolrkeys
          RENAME TO bibliographicsolrkeys_old;

        CREATE TABLE bibliographicsolrkeys AS
          SELECT agencyid, CAST('UNKNOWN' AS VARCHAR(16)) AS classifier, bibliographicrecordid, work, unit, producerversion, deleted, indexkeys, trackingid
          FROM bibliographicsolrkeys_old WITH DATA;

        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN agencyid SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN classifier SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN bibliographicrecordid SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN producerversion SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN deleted SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN trackingid SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN trackingid SET DEFAULT '';

        DROP TABLE bibliographicsolrkeys_old;

        ALTER TABLE bibliographicSolrKeys
          ADD CONSTRAINT bibliographicSolrKeys_pkey
          PRIMARY KEY (agencyId, classifier, bibliographicRecordId);
        -- SLOW - will time out on cluster health check
        -- Only run by hand after service is up - blocks create index in V6__ 
        CREATE INDEX bibliographicsolrkeysjson
--        CREATE INDEX CONCURRENTLY bibliographicsolrkeysjson
          ON bibliographicsolrkeys
          USING GIN (indexkeys jsonb_path_ops)
          WHERE indexkeys IS NOT NULL;

    END IF;
END
$$;
