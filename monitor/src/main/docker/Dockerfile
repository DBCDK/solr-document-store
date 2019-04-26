FROM docker.dbc.dk/payara5-micro:latest

ENV APPLICATION_NAME=SolrDocStoreMonitor \
    POOL_SIZE=2 \
    LOG__dk_dbc=INFO

LABEL DOCSTORE_POSTGRES_URL="Solr DocStore database url (required: user:pass@host:port/database)"

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
