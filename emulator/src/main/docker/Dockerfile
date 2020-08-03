FROM docker.dbc.dk/payara5-micro:latest

LABEL SOLR_DOC_STORE_URL="SolrDocStore url (required)"

# COPY target/docker/*.jar /opt/payara5/jars/

# Unconfigurable thread-pool in payara image
RUN echo "set server.thread-pools.thread-pool.http-thread-pool.max-thread-pool-size=500" >>scripts/prebootcommandfile.txt

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
