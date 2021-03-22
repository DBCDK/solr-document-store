FROM docker.dbc.dk/dbc-postgres-no-auto:10
MAINTAINER os-team

LABEL SOLR_DOC_STORE_QUEUE_NAMES="Comma separated list of default queue names (optional)";
COPY --chown=postgres:postgres src/main/docker/docker-entrypoint.d/* /docker-entrypoint.d/
COPY --chown=postgres:postgres target/solrdocstore-${project.version}.sql /docker-entrypoint.d/
