FROM docker.dbc.dk/payara-micro:latest

ADD config.d/* config.d
ADD *.war wars/

LABEL DOCSTORE_POSTGRES_URL="Database url (required)"