

-- USAGE: SELECT MANIFESTATIONID(bibliographicsolrkeys) FROM bibliographicsolrkeys LIMIT 1;

CREATE OR REPLACE FUNCTION manifestationid (IN record bibliographicsolrkeys) RETURNS TEXT AS
$$
  BEGIN
    RETURN record.agencyId || '-' || record.classifier || ':' || record.bibliographicrecordid;
  END;
$$ LANGUAGE plpgsql;
