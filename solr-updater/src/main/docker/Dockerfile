FROM docker.dbc.dk/dbc-payara
MAINTAINER os-team

ENV KAFKA_LOG_APPNAME solr-indexer-cloud-worker

LABEL SOLR_URL="zk or http url of solr-collection (required)" \
      SOLR_DOC_STORE_URL="http url of solr-doc-store-service (required)" \
      SOLR_DOC_STORE_DATABASE="user:pass@host[:port]/database where the queue is located (required)" \
      QUEUES="Comma separated list of queues to drain (required)" \
      DATABASE_CONNECT_THROTTLE="How much to throttle the database connection attempts, if they fail (default: 1/s,5/m)" \
      FAILURE_THROTTLE="How much to throttle the queue processing of script fails (default: 2/100ms,5/500ms,10/s,20/m)" \
      EMPTY_QUEUE_SLEEP="How long to sleep (in milliseconds) when the queue is empty (default: 10000)" \
      RESCAN_EVERY="How often to scan for newest timestamp, every n attempts to dequeue (default: 100)" \
      IDLE_RESCAN_EVERY="How often to scan for newest timestamp, when the queue is idle (default: 5)" \
      MAX_QUERY_TIME="How long a rescan query can take, before recalculating thre prepared statement quiery plan(default: 100)" \
      THREADS="Number of parallel threads (default: 1)"

ADD pre/* $PAYARA_CFG/pre/
ADD post/* $PAYARA_CFG/post/
ADD solr-doc-store-updater-1.0-SNAPSHOT.war $PAYARA_CFG/pre/solr-doc-store-updater.war
RUN payara-setup $PAYARA_CFG/pre/
