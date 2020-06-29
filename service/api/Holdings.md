# Solr-Doc-Store

## Holdings endpoint

Endpoint for updating holdings-items records.

`POST` to `[service]/holdings` with `JSON` content:

* `agencyId`: (integer) containing the offician library-number
* `bibliographicRecordId`: (string) the record identifier
* `producerVersion`: (string) identifying the JavaScript version
* `indexKeys`: (list-of-map-of-string-to-list-of-strings)
  The list entries represents different holdings for this agencyId/bibliographicRecordId combination
  The map contains SolR index values
  * The **key** in the map is the SolR field
  * The **value** in the map is a list of *unique* values for this key
* `trackingId`: (string) identifier for the source of this update
* `commitWithin`: (integer, optional) number carried through to solr-updater, and used to indicate when SolR should commit - currently not utilized in production.
