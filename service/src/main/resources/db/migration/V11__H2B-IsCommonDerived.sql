DO
$$
DECLARE
    hasnt BOOLEAN;
BEGIN
    SELECT COUNT(*) = 0 INTO hasnt FROM information_schema.columns WHERE table_name = 'holdingstobibliographic' AND column_name = 'iscommonderived';
    IF hasnt THEN

        ALTER TABLE holdingstobibliographic
          DROP CONSTRAINT holdingstobibliographic_pkey;

        ALTER TABLE holdingstobibliographic
          RENAME TO holdingstobibliographic_old;

        CREATE TABLE holdingstobibliographic AS
          SELECT h.*, librarytype = 'FBS' AND EXISTS(
            SELECT * FROM bibliographicsolrkeys WHERE bibliographicrecordid=h.bibliographicrecordid AND agencyid=870970 AND classifier='basis'
          ) AS isCommonDerived
          FROM holdingstobibliographic_old AS h JOIN agencylibrarytype AS a ON h.holdingsagencyid = a.agencyid;

        ALTER TABLE holdingstobibliographic
          ALTER COLUMN holdingsagencyid SET NOT NULL;

        ALTER TABLE holdingstobibliographic
          ALTER COLUMN holdingsbibliographicrecordid SET NOT NULL;

        ALTER TABLE holdingstobibliographic
          ALTER COLUMN bibliographicagencyid SET NOT NULL;

        ALTER TABLE holdingstobibliographic
          ALTER COLUMN bibliographicrecordid SET NOT NULL;

        ALTER TABLE holdingstobibliographic
          ALTER COLUMN isCommonDerived SET NOT NULL;

        ALTER TABLE holdingstobibliographic
          ADD CONSTRAINT holdingstobibliographic_pkey
          PRIMARY KEY (holdingsagencyid, holdingsbibliographicrecordid);

        DROP INDEX holdingstobibliographic_bibliographic;
        CREATE INDEX holdingstobibliographic_bibliographic
          ON holdingstobibliographic (bibliographicrecordid, bibliographicagencyid);

        CREATE INDEX holdingstobibliographic_bibliographiciscommon
          ON holdingstobibliographic (bibliographicrecordid, iscommonderived);

    END IF;
END
$$;
