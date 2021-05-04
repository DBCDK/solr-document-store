--- Run by hand - transaction might be long.

DELETE FROM holdingstobibliographic AS h2b WHERE NOT EXISTS(SELECT TRUE FROM holdingsitemssolrkeys AS hi WHERE h2b.holdingsagencyid = hi.agencyid AND h2b.holdingsbibliographicrecordid = hi.bibliographicrecordid AND hasliveholdings);
DELETE FROM holdingsitemssolrkeys WHERE NOT hasliveholdings;


DROP INDEX holdingsitemssolrkeys_agencyliveholdings;
ALTER TABLE holdingsitemssolrkeys DROP COLUMN hasliveholdings;
CREATE INDEX holdingsitemssolrkeys_agencyid
  ON holdingsitemssolrkeys (agencyid);

