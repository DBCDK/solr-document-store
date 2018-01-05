CREATE INDEX bibliographicSolrKeysJson on bibliographicSolrKeys USING GIN (indexKeys jsonb_path_ops) WHERE indexKeys IS NOT NULL;
CREATE INDEX holdingsItemsSolrKeysJson on holdingsItemsSolrKeys USING GIN (indexKeys jsonb_path_ops) WHERE indexKeys IS NOT NULL;
