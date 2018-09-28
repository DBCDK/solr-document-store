FROM docker.dbc.dk/dbc-payara5-full
MAINTAINER os-team

ENV KAFKA_LOG_APPNAME solr-doc-store-corepo-worker \
    APPLICATION_NAME solr-doc-store-corepo-worker

USER root
RUN apt-install zip
USER payara

LABEL COREPO_POSTGRES_URL="CORepo database url user:passwork@host:port/database (Required)" \
      SOLR_INDEXER_CLOUD_MQ_HOST="Message queue host (required)" \
      SOLR_INDEXER_CLOUD_MQ_PORT="Message queue port (optional, default is 7676)" \
      OPEN_AGENCY_URL="URL for OpenAgency service (required)" \
      POOL_SIZE="Number of parallel worker threads (optional, default is 2" \
      INPUT_QUEUE_NAME="Name of input queue (optional, default jms_pidQueue)" \
      ERROR_QUEUE_NAME="Name of error queue (optional, default is jms_deadPidQueue)" \
      SOLR_DOC_STORE_URL="http:// url of solr-doc-store endpoint (required)" \
      JSON_PRETTY_PRINT="Should json to solr-doc-store be prettyprinted (optional, default is false)" \
      COMMIT_WITHIN="How fast should a message be committeted when loaded into solr (<=0 is disabled) (optional, default is -1)"  \
      STANDALONE="if set to yes - no message driven bean is started, only http endpoint http://.../api/test/{pid}" \
      JAVASCRIPT_TEST="run with '-v $PWD:/javascript' to have scripts located here copied into container on startup"


COPY --chown=payara:payara startup.d/* /startup.d/
COPY --chown=payara:payara config/* $PAYARA_CFG_DIR
COPY --chown=payara:payara *.war $PAYARA_CFG_DIR/app.war

