
DO
$$
DECLARE
  has BOOLEAN;
BEGIN
    SELECT true INTO has FROM pg_indexes
        WHERE tablename='bibliographicsolrkeys' AND
              indexname='bibliographicsolrkeysjson';
    IF has IS NULL THEN
        -- RAISE NOTICE 'index "bibliographicsolrkeysjson" is unknown';
        SELECT true INTO has FROM bibliographicSolrKeys LIMIT 1;
        IF has = true THEN
            RAISE NOTICE 'table "bibliographicsolrkeys" has content';
        ELSE
            EXECUTE 'CREATE INDEX bibliographicsolrkeysjson on bibliographicsolrkeys USING GIN (indexkeys jsonb_path_ops) WHERE indexkeys IS NOT NULL';
        END IF;
    END IF;
END
$$;

DO
$$
DECLARE
  has BOOLEAN;
BEGIN
    SELECT true INTO has FROM pg_indexes
        WHERE tablename='holdingsitemssolrkeys' AND
              indexname='holdingsitemssolrkeysjson';
    IF has IS NULL THEN
        -- RAISE NOTICE 'index "holdingsitemssolrkeysjson" is unknown';
        SELECT true INTO has FROM holdingsitemsSolrKeys LIMIT 1;
        IF has = true THEN
            RAISE NOTICE 'table "holdingsitemssolrkeys" has content';
        ELSE
            EXECUTE 'CREATE INDEX holdingsitemssolrkeysjson on holdingsitemssolrkeys USING GIN (indexkeys jsonb_path_ops) WHERE indexkeys IS NOT NULL';
        END IF;
    END IF;
END
$$;

