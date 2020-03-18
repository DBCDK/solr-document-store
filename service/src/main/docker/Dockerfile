FROM docker.dbc.dk/payara5-micro:latest

LABEL DOCSTORE_POSTGRES_URL="Database url (required)" \
      OPEN_AGENCY_URL="Open Agency url (required)" \
      SYSTEM_NAME="System name (Optional)" \ 
      MAX_POOL_SIZE="Max number of connections to the database (default: 30)" \
      ALLOW_NON_EMPTY_SCHEMA="Allow tables in database whem dooing first migrate" \
      DELETE_MARKED_DELAY="How many ms a deleted bibliographic item should be delayed for processing (default: 200000)" \
      HOLDINGS_QUEUE_DELAY="How many ms a holdings item should be delayed for processing (default: 300000)"

COPY target/docker/*.jar /opt/payara5/jars/

# Unconfigurable thread-pool in payara image
RUN echo "set server.thread-pools.thread-pool.http-thread-pool.max-thread-pool-size=500" >>scripts/prebootcommandfile.txt

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
