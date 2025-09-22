FROM docker-de.artifacts.dbccloud.dk/pg-queue-monitor:latest
ENV JAVA_MAX_HEAP_SIZE=1g \
    PG_QUEUE_DIAG_COLLAPSE_PERCENTAGE_MATCH=60 \
    PG_QUEUE_SKIP_LIST=*-slow
COPY target/${project.artifactId}-${project.version}.jar deployments/${project.artifactId}.jar
