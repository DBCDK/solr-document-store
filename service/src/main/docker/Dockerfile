FROM docker.dbc.dk/payara5-micro:latest

LABEL DOCSTORE_POSTGRES_URL="Database url (required)" \
      SYSTEM_NAME="System (repository) name (optional)"\
      VIPCORE_ENDPOINT="Url for VipCore"\
      MAX_POOL_SIZE="Max number of connections to the database (default: 30)"

COPY target/docker/*.jar /opt/payara5/jars/

# Unconfigurable thread-pool in payara image
RUN echo "set server.thread-pools.thread-pool.http-thread-pool.max-thread-pool-size=500" >>scripts/prebootcommandfile.txt

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
