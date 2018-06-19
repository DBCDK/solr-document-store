#!/bin/bash -x

if [ -d /javascript ]; then
    echo "IMPORTING JAVASCRIPT"
    cp -avf /javascript/. $PAYARA_HOME/domain1/applications/corepo-worker/WEB-INF/classes/javascript
fi
