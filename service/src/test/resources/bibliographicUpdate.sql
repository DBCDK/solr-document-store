--- 4 items for different levels of records

INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'has970', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'has300', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'has300', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'has700', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'has700', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'clazzifier', 'has700', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'has700no300', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'clazzifier', 'has700no300', TRUE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'clazzifier', 'single700', FALSE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

-- Holdings keys

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has970', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has300', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has700', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'single700', '[]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has700no300', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300100, 'has700no300', '[]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has300', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has700', '[]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has970', '[]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'new', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'new', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300100, 'new', '[]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300200, 'new', '[]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (800000, 'new', '[]' :: JSONB, 'revision', 'track');


-- Values for testing proper holdings update
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600100, 'clazzifier', 'properUpdate', FALSE, '{}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (610510,'properUpdate','properUpdate',600100);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (610510, 'properUpdate', '[]' :: JSONB, 'revision', 'track');

-- Values for testing proper holdings update on delete
-- FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onDelete', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600521, 'clazzifier', 'onDelete', FALSE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600200, 'clazzifier', 'onDelete', FALSE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600200,'onDelete','onDelete',600200);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (620520,'onDelete','onDelete',600200);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (620521,'onDelete','onDelete',600521);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (620520, 'onDelete', '[]' :: JSONB, 'revision', 'track');
--INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
--VALUES (620521, 'onDelete', '[]' :: JSONB, 'revision', 'track');
-- FBS School
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'onDeleteSchool', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onDeleteSchool', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300200, 'clazzifier', 'onDeleteSchool', FALSE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (320520,'onDeleteSchool','onDeleteSchool',300200);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (320521,'onDeleteSchool','onDeleteSchool',300000);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (320520, 'onDeleteSchool', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (320521, 'onDeleteSchool', '[]' :: JSONB, 'revision', 'track');
-- No ancestor
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (633333, 'clazzifier', 'onDeleteSingle', FALSE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (644444,'onDeleteSingle','onDeleteSingle',633333);
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (644444, 'onDeleteSingle', '[]' :: JSONB, 'revision', 'track');


-- Values for testing proper holdings update on recreate
-- FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onRecreate', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600300, 'clazzifier', 'onRecreate', TRUE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600300,'onRecreate','onRecreate',870970);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600300, 'onRecreate', '[]' :: JSONB, 'revision', 'track');
-- FBS School
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'onRecreateSchool', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300300, 'clazzifier', 'onRecreateSchool', TRUE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300300,'onRecreateSchool','onRecreateSchool',300000);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300300, 'onRecreateSchool', '[]' :: JSONB, 'revision', 'track');
-- No ancestor
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (655555, 'clazzifier', 'onRecreateSingle', TRUE, '{"something": ["true"]}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (607000,'onRecreateSingle','onRecreateSingle',655555);
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600700, 'onRecreateSingle', '[]' :: JSONB, 'revision', 'track');

-- No related holdings
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (780780, 'clazzifier', 'onDeleteNoHoldings', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (340340, 'clazzifier', 'onDeleteNoHoldings2', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onDeleteNoHoldings3', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'onDeleteNoHoldings4', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

-- Delete supersede FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onDeleteSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600400, 'clazzifier', 'onDeleteSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600400,'onDeleteSupersede','onDeleteSupersedeNew',600400);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600401,'onDeleteSupersede','onDeleteSupersedeNew',600400);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600402,'onDeleteSupersede','onDeleteSupersedeNew',600400);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600400, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600401, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600402, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');

INSERT INTO bibliographicToBibliographic (DEADBIBLIOGRAPHICRECORDID,LIVEBIBLIOGRAPHICRECORDID)
VALUES ('onDeleteSupersede','onDeleteSupersedeNew');
-- Delete supersede FBSSchool
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'onDeleteSchoolSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onDeleteSchoolSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300400, 'clazzifier', 'onDeleteSchoolSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300400,'onDeleteSchoolSupersede','onDeleteSchoolSupersedeNew',300400);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300401,'onDeleteSchoolSupersede','onDeleteSchoolSupersedeNew',300400);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300402,'onDeleteSchoolSupersede','onDeleteSchoolSupersedeNew',300400);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300400, 'onDeleteSchoolSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300401, 'onDeleteSchoolSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (300402, 'onDeleteSchoolSupersede', '[]' :: JSONB, 'revision', 'track');

INSERT INTO bibliographicToBibliographic (DEADBIBLIOGRAPHICRECORDID,LIVEBIBLIOGRAPHICRECORDID)
VALUES ('onDeleteSchoolSupersede','onDeleteSchoolSupersedeNew');

-- Re-create supersede FBS
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onRecreateSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600500, 'clazzifier', 'onRecreateSupersedeNew', TRUE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (600502, 'clazzifier', 'onRecreateSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600500,'onRecreateSupersede','onRecreateSupersedeNew',870970);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600501,'onRecreateSupersede','onRecreateSupersedeNew',870970);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (600502,'onRecreateSupersede','onRecreateSupersedeNew',600502);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600500, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600501, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600502, 'onDeleteSupersede', '[]' :: JSONB, 'revision', 'track');

INSERT INTO bibliographicToBibliographic (DEADBIBLIOGRAPHICRECORDID,LIVEBIBLIOGRAPHICRECORDID)
VALUES ('onRecreateSupersede','onRecreateSupersedeNew');
-- Re-create supersede FBSSchool
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'clazzifier', 'onRecreateSchoolSupersedeNew', TRUE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'clazzifier', 'onRecreateSchoolSupersedeNew', FALSE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300500, 'clazzifier', 'onRecreateSchoolSupersedeNew', TRUE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');
INSERT INTO bibliographicSolrKeys (AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300502, 'clazzifier', 'onRecreateSchoolSupersedeNew', TRUE, '{"somethingElse": ["true"]}' :: JSONB, '5544:higher', 'track:higher', 'unit:higher', 'work:higher');

INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300500,'onRecreateSchoolSupersede','onRecreateSchoolSupersedeNew',870970);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300501,'onRecreateSchoolSupersede','onRecreateSchoolSupersedeNew',870970);
INSERT INTO holdingsToBibliographic (HOLDINGSAGENCYID, HOLDINGSBIBLIOGRAPHICRECORDID, BIBLIOGRAPHICRECORDID, BIBLIOGRAPHICAGENCYID)
VALUES (300502,'onRecreateSchoolSupersede','onRecreateSchoolSupersedeNew',870970);

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600500, 'onRecreateSchoolSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600501, 'onRecreateSchoolSupersede', '[]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (600502, 'onRecreateSchoolSupersede', '[]' :: JSONB, 'revision', 'track');

INSERT INTO bibliographicToBibliographic (DEADBIBLIOGRAPHICRECORDID,LIVEBIBLIOGRAPHICRECORDID)
VALUES ('onRecreateSchoolSupersede','onRecreateSchoolSupersedeNew');

