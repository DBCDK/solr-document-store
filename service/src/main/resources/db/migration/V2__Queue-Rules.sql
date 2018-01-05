CREATE TABLE queueRule (
    queue VARCHAR(50) NOT NULL,
    PRIMARY KEY ( queue )
);

CREATE FUNCTION queueNotify () RETURNS trigger AS $$
    BEGIN
        NOTIFY queueNotify;
        RETURN NEW;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER queueNotifyTrigger
    AFTER INSERT OR DELETE OR UPDATE
    ON queueRule
    EXECUTE PROCEDURE queueNotify();

