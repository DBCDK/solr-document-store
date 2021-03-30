#!/bin/bash -x

(
    echo "\set ON_ERROR_STOP"
    for queue in $(echo ${SOLR_DOC_STORE_QUEUES//,/ }); do
        echo "INSERT INTO queuerule(queue, supplier, postpone) values('${queue//|/\', \'}');"
    done
) | PGPASSWORD=$POSTGRES_PASSWORD psql $POSTGRES_USER -d $POSTGRES_DB
