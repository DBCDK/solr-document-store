
--- CREATE INDEX CONCURRENTLY bibliographicsolrkeys_unit on bibliographicsolrkeys (unit) WHERE unit IS NOT NULL;
CREATE INDEX IF NOT EXISTS bibliographicsolrkeys_unit on bibliographicsolrkeys (unit) WHERE unit IS NOT NULL;

