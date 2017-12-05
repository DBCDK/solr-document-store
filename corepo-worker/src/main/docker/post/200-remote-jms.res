[configs/config/server-config/jms-service]
type = REMOTE

[configs/config/server-config/jms-service/jms-host/default_JMS_host]
host = ${SOLR_INDEXER_CLOUD_MQ_HOST}
port = ${SOLR_INDEXER_CLOUD_MQ_PORT|7676}
