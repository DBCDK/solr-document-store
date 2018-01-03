#!/bin/bash

branch=`git rev-parse --abbrev-ref HEAD`
if [ x$branch = xmaster ]; then
	branch=latest
fi
branch="${branch,,}"
branch=( ${branch//[^0-9a-z]/ } )
branch=$(IFS=-; echo "${branch[*]}")
version=`xmlstarlet sel -N m=http://maven.apache.org/POM/4.0.0 -t -v '/*/m:version' pom.xml | tr A-Z a-z`
name=`xmlstarlet sel -N m=http://maven.apache.org/POM/4.0.0 -t -v '/*/m:artifactId' pom.xml`
for module in `xmlstarlet sel -N m=http://maven.apache.org/POM/4.0.0 -t -v '/*/m:modules/m:module' pom.xml`; do
	if [ -e $module/src/main/docker/Dockerfile ]; then
		echo module=$module
		(
			cd $module/src/main/docker
			if [ -e prepare.sh ]; then
				chmod +x prepare.sh
				./prepare.sh
			fi
			rm -f *.war
			cp -f ../../../target/*.war .
			set -x
			docker build -t $name-$module-$version:$branch .
		)
	fi

done

