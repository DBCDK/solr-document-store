add_jdbc_resource_from_url "jdbc/solr-doc-store" ${DOCSTORE_POSTGRES_URL}
add_jdbc_resource_from_url "jdbc/solr-doc-store-nt" ${DOCSTORE_POSTGRES_URL} 'non-transactional-connections="true"'
