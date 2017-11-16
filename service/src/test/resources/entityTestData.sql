INSERT INTO bibliographicSolrKeys (ID, AGENCYID, BIBLIOGRAPHICRECORDID, COMMITWITHIN, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
     VALUES ('id:3', 300, '4321', 7788, TRUE , '{"ti": ["isdnBogen", "title2"] , "001": ["argle"] }'::jsonb, '5544','track', 'unit:3', 'work:3');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, COMMITWITHIN, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
     VALUES ( 300, '4321', 4444, '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'revision','track');
