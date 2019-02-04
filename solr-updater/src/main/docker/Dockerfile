FROM docker.dbc.dk/payara5-micro:os

ENV APPLICATION_NAME=solr-doc-store-updater \
    ADD_PAYARA_ARGS=--nocluster

LABEL SOLR_URL="zk or http url of solr-collection (required)" \
      SOLR_DOC_STORE_URL="http url of solr-doc-store-service (required)" \
      SOLR_DOC_STORE_DATABASE="user:pass@host[:port]/database where the queue is located (required)" \
      QUEUES="Comma separated list of queues to drain (required)" \
      DATABASE_CONNECT_THROTTLE="How much to throttle the database connection attempts, if they fail (default: 1/s,5/m)" \
      FAILURE_THROTTLE="How much to throttle the queue processing of script fails (default: 2/100ms,5/500ms,10/s,20/m)" \
      EMPTY_QUEUE_SLEEP="How long to sleep when the queue is empty (default: '10s')" \
      QUEUE_WINDOW="How long to sleep when the queue is empty (default: '1s')" \
      RESCAN_EVERY="How often to scan for newest timestamp, every n attempts to dequeue (default: 100)" \
      IDLE_RESCAN_EVERY="How often to scan for newest timestamp, when the queue is idle (default: 5)" \
      MAX_QUERY_TIME="How long a rescan query can take, before recalculating thre prepared statement quiery plan(default: '100ms')" \
      THREADS="Number of parallel threads (default: 1)" \
      MAX_TRIES="Number of tries to process job (default: 3)" \
      OPEN_AGENCY_URL="URL for OpenAgency service (required)" \
      OPEN_AGENCY_AGE="Caching of successful openagency call (default: 4h)" \
      OPEN_AGENCY_FAILURE_AGE="Caching of unsuccessful result (default: 5m)"\
      OPEN_AGENCY_TIMEOUT="Open agency timeout (default: 1m)" \
      JSON_STASH="Path for storing posted documents as JSON for generating test data (optional)"

ADD config.d/* config.d
ADD *.war wars/
