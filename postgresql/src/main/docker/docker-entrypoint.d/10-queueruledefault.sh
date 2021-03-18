#!/bin/bash -x

(
    echo "\set ON_ERROR_STOP"
    for queue in $(echo ${SOLR_DOC_STORE_QUEUE_NAMES//[^-0-9a-zA-Z]/ }); do
        echo "INSERT INTO queuerule(queue) values('$queue');"
    done
) | PGPASSWORD=$POSTGRES_PASSWORD psql $POSTGRES_USER -d $POSTGRES_DB
