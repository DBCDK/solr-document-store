INSERT INTO bibliographicSolrKeys ( AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
     VALUES ( 300, 'clazzifier', '4321', 'id#1', TRUE , '{"ti": ["isdnBogen", "title2"] , "001": ["argle"] }'::jsonb, '5544','track', 'unit:3', 'work:3');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
     VALUES ( 300, '4321', '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'revision','track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
     VALUES ( 600, '600', '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'revision','track');


INSERT INTO holdingsTobibliographic (holdingsagencyid,holdingsbibliographicrecordid, bibliographicagencyid, bibliographicrecordid, isCommonDerived ) VALUES (600, '600', 100,'600', false);

INSERT INTO bibliographictobibliographic (deadBibliographicRecordId, liveBibliographicRecordId) VALUES ('399', '600');