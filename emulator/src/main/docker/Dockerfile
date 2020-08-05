FROM docker.dbc.dk/payara5-micro:latest
MAINTAINER os-team

LABEL SOLR_DOC_STORE_URL="SolrDocStore url (required)"

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
