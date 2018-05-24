
CREATE TABLE OpenAgencyCacheDefault (
    agencyId NUMERIC(6) NOT NULL,
    libraryType TEXT NOT NULL,
    partOfDanbib BOOLEAN NOT NULL,
    authCreateCommonRecord BOOLEAN NOT NULL,
    fetched TIMESTAMP NOT NULL,
    valid BOOLEAN NOT NULL,
    PRIMARY KEY (agencyId)
);

INSERT INTO OpenAgencyCacheDefault VALUES(300101, 'FBSSchool', False, False, now(), TRUE);
INSERT INTO OpenAgencyCacheDefault VALUES(300102, 'FBSSchool', False, False, now(), TRUE);
INSERT INTO OpenAgencyCacheDefault VALUES(300103, 'FBSSchool', False, False, now(), TRUE);
INSERT INTO OpenAgencyCacheDefault VALUES(300010, 'FBSSchool', False, False, now(), TRUE);
INSERT INTO OpenAgencyCacheDefault VALUES(300000, 'FBSSchool', False, False, now(), TRUE);
INSERT INTO OpenAgencyCacheDefault VALUES(777777, 'FBS', True, True, now(), TRUE);
