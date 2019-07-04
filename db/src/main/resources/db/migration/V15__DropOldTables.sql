DROP TABLE IF EXISTS holdingsitemssolrkeys_old;
DROP TABLE IF EXISTS holdingstobibliographic_old;

DO
$$
DECLARE
    hasnt BOOLEAN;
BEGIN
    SELECT COUNT(*) = 0 INTO hasnt FROM pg_indexes WHERE indexname='holdingsitemssolrkeys_pkey';
    IF hasnt THEN

        ALTER TABLE holdingsitemssolrkeys
          ADD CONSTRAINT holdingsitemssolrkeys_pkey
          PRIMARY KEY (agencyid, bibliographicrecordid);

    END IF;
END
$$;
