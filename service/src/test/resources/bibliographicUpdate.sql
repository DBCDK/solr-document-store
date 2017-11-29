--- 4 items for different levels of records

INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'has970', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'has300', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'has300', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'has700', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (300000, 'has700', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'has700', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (870970, 'has700no300', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');
INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'has700no300', TRUE, '{
    "ti": [
        "has970"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');


INSERT INTO bibliographicSolrKeys (AGENCYID, BIBLIOGRAPHICRECORDID, DELETED, INDEXKEYS, PRODUCERVERSION, TRACKINGID, UNIT, WORK)
VALUES (700000, 'single700', TRUE, '{
    "ti": [
        "single"
    ]
}' :: JSONB, '5544', 'track', 'unit:3', 'work:3');

-- Holdings keys

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has970', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has300', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has700', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');

INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'single700', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'has700no300', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has300', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');
INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has700', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700100, 'has970', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');


INSERT INTO holdingsitemssolrkeys (AGENCYID, BIBLIOGRAPHICRECORDID, INDEXKEYS, PRODUCERVERSION, TRACKINGID)
VALUES (700000, 'new', '[
    {
        "id": [
            "argle"
        ]
    }
]' :: JSONB, 'revision', 'track');



