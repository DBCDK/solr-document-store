#!/bin/bash -x

if [ -d /javascript ]; then
    echo "IMPORTING JAVASCRIPT"
    (cd / && zip -ur0 --exclude=*/.svn/* --exclude=*/.git/* --exclude=*.test.js $PAYARA_CFG_DIR/app.war javascript)
fi
