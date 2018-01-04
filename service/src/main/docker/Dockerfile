FROM docker.dbc.dk/payara-micro:latest

ADD config.d/* config.d
ADD *.war wars/

LABEL DOCSTORE_POSTGRES_URL="Database url (required)" \
      OPEN_AGENCY_URL="Open Agency url (required)" \
      MANIFESTATION_QUEUES="Comma separated list of queue names"
