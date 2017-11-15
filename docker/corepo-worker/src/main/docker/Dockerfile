FROM docker.dbc.dk/dbc-payara-mq
MAINTAINER os-team

ENV KAFKA_LOG_APPNAME solr-indexer-cloud-worker

ADD corepo-ee-shard.sh /docker-entrypoint-confd.d/

ADD pre/* $PAYARA_CFG/pre/
ADD post/* $PAYARA_CFG/post/
ADD res/solr-indexer-cloud-worker.war $PAYARA_CFG/pre/
RUN payara-setup $PAYARA_CFG/pre/

LABEL COREPO_ROOT="CORepo database url user:passwork@host:port/database (Required)" \
      COREPO_SHARDn="CORepo shard database url user:passwork@host:port/database" \
      SOLR_INDEXER_CLOUD_MQ_HOST="Message queue host (required)" \
      SOLR_INDEXER_CLOUD_MQ_PORT="Message queue port (optional, default is 7676)" \
      OPEN_AGENCY_URL="URL for OpenAgency service (required)" \
      POOL_SIZE="Number of parallel worker threads (optional, default is 2" \
      INPUT_QUEUE_NAME="Name of input queue (optional, default jms_pidQueue)" \
      ERROR_QUEUE_NAME="Name of error queue (optional, default is jms_deadPidQueue)" \
      SOLR_DOC_STORE_URL="http:// url of solr-doc-store endpoint (required)" \
      JSON_PRETTY_PRINT="Should json to solr-doc-store be prettyprinted (optional, default is false)"
