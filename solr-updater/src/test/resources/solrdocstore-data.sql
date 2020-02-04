
CREATE TABLE OpenAgencyCacheDefault (
    agencyId NUMERIC(6) NOT NULL,
    libraryType TEXT NOT NULL,
    partOfBibDk BOOLEAN NOT NULL,
    partOfDanbib BOOLEAN NOT NULL,
    authCreateCommonRecord BOOLEAN NOT NULL,
    fetched TIMESTAMP NOT NULL,
    valid BOOLEAN NOT NULL,
    PRIMARY KEY (agencyId)
);

INSERT INTO OpenAgencyCacheDefault (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES
 (300101, 'FBSSchool', False, False, False, now(), TRUE),
 (300102, 'FBSSchool', False, False, False, now(), TRUE),
 (300103, 'FBSSchool', False, False, False, now(), TRUE),
 (300010, 'FBSSchool', False, False, False, now(), TRUE),
 (300000, 'FBSSchool', False, False, False, now(), TRUE),
 (777777, 'FBS', True, True, True, now(), TRUE);
