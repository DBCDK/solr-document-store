DO
$$
DECLARE
    hasnt BOOLEAN;
BEGIN
    SELECT COUNT(*) = 0 INTO hasnt FROM information_schema.columns WHERE table_name = 'bibliographicsolrkeys' AND column_name = 'repositoryid';
    IF hasnt THEN

        ALTER TABLE bibliographicSolrKeys
          DROP CONSTRAINT bibliographicSolrKeys_pkey;
        DROP INDEX bibliographicsolrkeysjson;
        ALTER TABLE bibliographicsolrkeys
          RENAME TO bibliographicsolrkeys_old;

        CREATE TABLE bibliographicsolrkeys AS
          SELECT agencyid, classifier, bibliographicrecordid, CAST(CASE WHEN indexkeys#>>'{rec.repositoryId,0}' IS NULL THEN '' ELSE indexkeys#>>'{rec.repositoryId,0}' END AS VARCHAR(64)) AS repositoryid, work, unit, producerversion, deleted, indexkeys, trackingid
          FROM bibliographicsolrkeys_old WITH DATA;

        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN agencyid SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN classifier SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN bibliographicrecordid SET NOT NULL;
        ALTER TABLE bibliographicSolrKeys
          ALTER COLUMN repositoryId SET NOT NULL;
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

        CREATE INDEX bibliographicsolrkeys_bibliographicrecordid
          ON bibliographicsolrkeys(bibliographicrecordid);

        CREATE INDEX bibliographicsolrkeys_ab
          ON bibliographicsolrkeys(agencyid, bibliographicrecordid);

    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS bibliographicsolrkeys_repositoryid ON bibliographicsolrkeys(repositoryid);
