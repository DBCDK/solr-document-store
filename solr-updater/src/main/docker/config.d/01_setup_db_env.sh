add_jdbc_resource_from_url "jdbc/solr-doc-store" ${SOLR_DOC_STORE_DATABASE} max-pool-size=${THREADS:-2} steady-pool-size=$(( (1 + ${THREADS:-2}) / 2))
