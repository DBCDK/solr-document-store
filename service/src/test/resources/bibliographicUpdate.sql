--- 4 items for different levels of records

INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'has970', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'has300', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (300000, 'katalog', 'has300', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'has700', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (300000, 'katalog', 'has700', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (700000, 'katalog', 'has700', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'has700no300', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (700000, 'katalog', 'has700no300', 'id#0', TRUE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (700000, 'katalog', 'single700', 'id#0', FALSE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');

-- Holdings keys

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'has970', '[]' :: JSONB, 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'has300', '[]' :: JSONB, 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'has700', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'single700', '[]' :: JSONB, 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'has700no300', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (300100, 'has700no300', '[]' :: JSONB, 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700100, 'has300', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700100, 'has700', '[]' :: JSONB, 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700100, 'has970', '[]' :: JSONB, 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700000, 'new', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (700100, 'new', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (300100, 'new', '[]' :: JSONB, 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (300200, 'new', '[]' :: JSONB, 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (800000, 'new', '[]' :: JSONB, 'track');

-- Values for testing proper delay on update
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (600100, 'katalog', 'delay', 'id#0', FALSE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');

-- Values for testing proper holdings update
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (600100, 'katalog', 'properUpdate', 'id#0', FALSE, '{}' :: JSONB, 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (610510,'properUpdate',600100, FALSE);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (610510, 'properUpdate', '[]' :: JSONB, 'track');

-- Values for testing proper holdings update on delete
-- FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'onDelete', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (600521, 'katalog', 'onDelete', 'id#0', FALSE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (600200, 'katalog', 'onDelete', 'id#0', FALSE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (600200,'onDelete',600200, TRUE);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (620521,'onDelete',600521, TRUE);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (620520, 'onDelete', '[]' :: JSONB, 'track');
--INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
--VALUES (620521, 'onDelete', '[]' :: JSONB, 'track');
-- FBS School

-- INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
-- VALUES (300000, 'katalog', 'onDeleteSchool', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
-- INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
-- VALUES (870970, 'basis', 'onDeleteSchool', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
-- INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
-- VALUES (300200, 'katalog', 'onDeleteSchool', 'id#0', FALSE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');
--
-- INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
-- VALUES (320520,'onDeleteSchool',300200, FALSE);
-- INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
-- VALUES (320521,'onDeleteSchool',300000, FALSE);
--
-- INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
-- VALUES (320520, 'onDeleteSchool', '[]' :: JSONB, 'track');
-- INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
-- VALUES (320521, 'onDeleteSchool', '[]' :: JSONB, 'track');
-- No ancestor
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (633333, 'katalog', 'onDeleteSingle', 'id#0', FALSE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (644444,'onDeleteSingle',633333, FALSE);
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (644444, 'onDeleteSingle', '[]' :: JSONB, 'track');


-- Values for testing proper holdings update on recreate
-- FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'onRecreate', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (600300, 'katalog', 'onRecreate', 'id#0', TRUE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (600300,'onRecreate',870970, TRUE);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (600300, 'onRecreate', '[]' :: JSONB, 'track');
-- FBS School
-- INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
-- VALUES (300000, 'katalog', 'onRecreateSchool', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
--
-- INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
-- VALUES (300300, 'katalog', 'onRecreateSchool', 'id#0', TRUE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');
--
-- INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
-- VALUES (300300,'onRecreateSchool',300000, FALSE);
--
-- INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
-- VALUES (300300, 'onRecreateSchool', '[]' :: JSONB, 'track');
-- No ancestor
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (655555, 'katalog', 'onRecreateSingle', 'id#0', TRUE, '{"something": ["true"]}' :: JSONB, 'track', 'unit:3', 'work:3');
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID, ISCOMMONDERIVED)
VALUES (607000,'onRecreateSingle',655555, FALSE);
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, TRACKINGID)
VALUES (600700, 'onRecreateSingle', '[]' :: JSONB, 'track');

-- No related holdings
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (780780, 'katalog', 'onDeleteNoHoldings', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (340340, 'katalog', 'onDeleteNoHoldings2', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (870970, 'basis', 'onDeleteNoHoldings3', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK)
VALUES (300000, 'katalog', 'onDeleteNoHoldings4', 'id#0', FALSE, '{"somethingElse": ["true"]}' :: JSONB, 'track:higher', 'unit:higher', 'work:higher');

