FROM docker-dbc.artifacts.dbccloud.dk/dbc-postgres-13:latest
MAINTAINER de-team

LABEL SOLR_DOC_STORE_QUEUES="Comma separated list of default queuerules 'queue|supplier|postpone,queue|supplier|postpone...' (optional)";
COPY --chown=postgres:postgres src/main/docker/docker-entrypoint.d/* /docker-entrypoint.d/
COPY --chown=postgres:postgres target/solrdocstore-${project.version}.sql /docker-entrypoint.d/
