#!/bin/bash -x

if [ x"$STANDALONE" = xyes ]; then
    rm -f $PAYARA_CFG_DIR/300-mdb.set
    rm -f $PAYARA_CFG_DIR/*.jms
    zip -d $PAYARA_CFG_DIR/app.war WEB-INF/classes/dk/dbc/cloud/worker/SolrWorker.class
fi
