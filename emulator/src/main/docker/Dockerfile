FROM docker-dbc.artifacts.dbccloud.dk/payara6-micro:latest
LABEL maintainer="Team Search os-team@dbc.dk"

LABEL SOLR_DOC_STORE_URL="SolrDocStore url (required)"

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
