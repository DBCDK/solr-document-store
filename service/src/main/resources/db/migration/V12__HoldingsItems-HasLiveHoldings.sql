DO
$$
DECLARE
    hasnt BOOLEAN;
BEGIN
    SELECT COUNT(*) = 0 INTO hasnt FROM information_schema.columns WHERE table_name = 'holdingsitemssolrkeys' AND column_name = 'hasliveholdings';
    IF hasnt THEN

        ALTER TABLE holdingsitemssolrkeys
          DROP CONSTRAINT holdingsitemssolrkeys_pkey;

        ALTER TABLE holdingsitemssolrkeys
          RENAME TO holdingsitemssolrkeys_old;

        CREATE TABLE holdingsitemssolrkeys AS
          SELECT agencyid, bibliographicrecordid, producerversion,
            TRUE IN (SELECT 'Decommissioned' <> JSONB_ARRAY_ELEMENTS_TEXT(JSONB_ARRAY_ELEMENTS(indexkeys)->'holdingsitem.status')) AS hasLiveHoldings,
            indexkeys, trackingid
          FROM holdingsitemssolrkeys_old;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN agencyid SET NOT NULL;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN bibliographicrecordid SET NOT NULL;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN producerversion SET NOT NULL;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN hasLiveHoldings SET NOT NULL;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN trackingid SET NOT NULL;

        ALTER TABLE holdingsitemssolrkeys
          ALTER COLUMN trackingid SET DEFAULT '';

        DROP INDEX holdingsitemssolrkeys_bibliographicrecordid;
        CREATE INDEX holdingsitemssolrkeys_bibliographicrecordid
          ON holdingsitemssolrkeys (bibliographicrecordid);

        DROP INDEX holdingsitemssolrkeysjson;

        CREATE INDEX holdingsitemssolrkeys_agencyliveholdings
          ON holdingsitemssolrkeys (agencyid, hasliveholdings);

    END IF;
END
$$;
