#!/bin/bash -x

(
    echo "\set ON_ERROR_STOP"
    echo "CREATE TABLE queueruledefault ( queue VARCHAR(54) NOT NULL );"
    for queue in $(echo ${SOLR_DOC_STORE_QUEUE_NAMES//[^-0-9a-zA-Z]/ }); do
        echo "INSERT INTO queueruledefault(queue) values('$queue');"
    done
) | psql postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB
