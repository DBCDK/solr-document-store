FROM docker.dbc.dk/payara-micro:jdbc-options

ENV APPLICATION_NAME=SolrDocStore \
    MAX_POOL_SIZE=30

LABEL DOCSTORE_POSTGRES_URL="Database url (required)" \
      OPEN_AGENCY_URL="Open Agency url (required)" \
      SYSTEM_NAME="System name (Optional)" \ 
      MAX_POOL_SIZE="Max number of connections to the database (default: 30)"

ADD config.d/* config.d
ADD *.war wars/

