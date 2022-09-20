
DROP TABLE BibliographicToBibliographic;

DROP INDEX holdingstobibliographic_bibliographic;
ALTER TABLE holdingstobibliographic DROP COLUMN bibliographicrecordid;
ALTER TABLE holdingstobibliographic RENAME COLUMN holdingsbibliographicrecordid TO bibliographicrecordid;
CREATE INDEX holdingstobibliographic_bibliographic
  ON holdingstobibliographic (bibliographicrecordid, bibliographicagencyid);


