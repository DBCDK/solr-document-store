INSERT INTO bibliographicSolrKeys ( AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
     VALUES ( 300, 'clazzifier', '4321', 'id#1', TRUE , '{"ti": ["isdnBogen", "title2"] , "001": ["argle"] }'::jsonb,'track', 'unit:3', 'work:3');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, HASLIVEHOLDINGS, INDEXKEYS, TRACKINGID)
     VALUES ( 300, '4321', TRUE, '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, HASLIVEHOLDINGS, INDEXKEYS, TRACKINGID)
     VALUES ( 600, '600', FALSE, '[{"id": ["argle"], "title": ["unix bogen"]}, {"id": ["argle"], "dyr": ["hest"], "title": ["unix bogen"]}]'::jsonb, 'track');


INSERT INTO holdingsTobibliographic (holdingsagencyid,holdingsbibliographicrecordid, bibliographicagencyid, bibliographicrecordid, isCommonDerived ) VALUES (600, '600', 100,'600', false);

INSERT INTO bibliographictobibliographic (deadBibliographicRecordId, liveBibliographicRecordId) VALUES ('399', '600');