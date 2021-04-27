FROM docker.dbc.dk/payara5-micro:latest

COPY target/docker/*.jar /opt/payara5/jars/

ENV THREADS=1 \
    MAX_POOL_SIZE=3 \
    CACHE_TIMEOUT=60 \
    USER_AGENT="solr-doc-store-solr-updater/1.1"

LABEL SOLR_URL="(zk-/httpurl[=features]) (semicolon seperated list) of solr-collection (required see also ZOOKEEPER_URL/ZOOKEEPER_COLLECTIONS and doc_FEATURES)" \
      ZOOKEEPER_URL="zk:// type url for the zookeeper" \
      ZOOKEEPER_COLLECTIONS="collections in the zookeeper (this is shorthand for SOLR_URL+=',$ZOOEEPER_URL/$ZOOEEPER_COLLECTION...')" \
      SOLR_APPID="Application ID pass to SOLR, for logging in SOLR (Required)" \
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
      MAX_POOL_SIZE="Max number of connections to the database, should be THREADS+1 (default: 3)" \
      MAX_TRIES="Number of tries to process job (default: 3)" \
      VIPCORE_ENDPOINT="URL for VipCore service (required)" \
      WORK_PRESENTATION_ENDPOINT="URL for work presentation service (required)" \
      PERSISTENT_WORK_ID_FAILURE_POSTPONE="How long to wait if no persistentWorkId is present (default: 5s)"
      OPEN_AGENCY_AGE="Caching of successful openagency call (default: 4h)" \
      OPEN_AGENCY_FAILURE_AGE="Caching of unsuccessful result (default: 5m)"\
      OPEN_AGENCY_TIMEOUT="Open agency timeout (default: 1m)" \
      JSON_STASH="Path for storing posted documents as JSON for generating test data (optional)" \
      CACHE_TIMEOUT="profile-service cache timeout in seconds (default: 60)" \
      SCAN_PROFILES="Comma separated list of {agency}-{profile}, that can scan (required)" \
      SCAN_DEFAULT_FIELDS="COmma separated list of scan.field that scan.ddefault covers (required)" \
      USER_AGENT="Useragent string to use for http-client" \
      SCOPE="Name of service (for cache identification)" \
      COLLECTION="Name of collection (for cache identification)" \
      doc_FEATURES="feature set as after = on collection-url is list of +- features ie. all-800000-scan or (none+)scan+role... scan+all is all (left to right)"

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
