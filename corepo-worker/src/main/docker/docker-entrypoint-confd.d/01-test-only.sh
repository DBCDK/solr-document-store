#!/bin/bash -x

if [ x"$STANDALONE" = xyes ]; then
    rm -f $PAYARA_CFG/post/100-mdb-container.res
    rm -f $PAYARA_CFG/post/101.restart
    rm -f $PAYARA_CFG/post/101-remote-jms.res
    rm -f $PAYARA_CFG/post/800-mq.jms
    rm -f $PAYARA_HOME/domain1/applications/corepo-worker/WEB-INF/classes/dk/dbc/cloud/worker/SolrWorker.class
fi
