FROM docker.dbc.dk/payara5-micro:latest

LABEL DOCSTORE_POSTGRES_URL="Database url (required)" \
      OPEN_AGENCY_URL="Open Agency url (required)" \
      SYSTEM_NAME="System name (Optional)" \ 
      MAX_POOL_SIZE="Max number of connections to the database (default: 30)" \
      ALLOW_NON_EMPTY_SCHEMA="Allow tables in database whem dooing first migrate"

COPY target/${project.build.finalName}.war target/docker/app.json deployments/
