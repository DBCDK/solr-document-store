CREATE INDEX bibliographicSolrKeysJson on bibliographicSolrKeys USING GIN (indexKeys jsonb_path_ops);
CREATE INDEX holdingsItemsSolrKeysJson on holdingsItemsSolrKeys USING GIN (indexKeys jsonb_path_ops);
