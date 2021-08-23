
DO
$$
DECLARE
  has BOOLEAN;
BEGIN
    SELECT true INTO has FROM pg_indexes
        WHERE tablename='bibliographicsolrkeys' AND
              indexname='bibliographicsolrkeys_work';
    IF has IS NULL THEN
        -- RAISE NOTICE 'index "bibliographicsolrkeysjson" is unknown';
        SELECT true INTO has FROM bibliographicSolrKeys LIMIT 1;
        IF has = true THEN
            RAISE NOTICE 'table "bibliographicsolrkeys" has content';
        ELSE
            EXECUTE 'CREATE INDEX bibliographicsolrkeys_work on bibliographicsolrkeys (work) WHERE work IS NOT NULL';
        END IF;
    END IF;
END
$$;

