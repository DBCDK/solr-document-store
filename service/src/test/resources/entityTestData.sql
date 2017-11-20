INSERT INTO bibliographicSolrKeys ( AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
     VALUES ( 300, '4321', TRUE , '{"ti": ["isdnBogen", "title2"] , "001": ["argle"] }'::jsonb, '5544','track', 'unit:3', 'work:3');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
     VALUES ( 300, '4321', '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'revision','track');
