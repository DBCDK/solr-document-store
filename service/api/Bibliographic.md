# Solr-Doc-Store

## Bibliographic endpoint

Endpoint for updating bibliographic records.

`POST` to `[service]/bibliographic` with `JSON` content:

* `agencyId`: (integer) containing the official library-number
* `classifier`: (string) the collection within the agency, usually but not limited to *basic* or *katalog*
* `bibliographicRecordId`: (string) the record identifier
* `repositoryId`: (string) the identifier of the generating record
* `work`: (string) the work identifier
* `unit`: (string) the unit identifier
* `producerVersion`: (string) identifies the JavaScript version
* `deleted`: (boolean) whether the record is deleted
* `indexKeys`: (map-of-string-to-list-of-strings, optional)
  If `deleted` is **false** then this key is required
  The map contains SolR index values
  * The **key** in the map is the SolR field
  * The **value** in the map is a list of *unique* values for this key
* `trackingId`: (string) identifier for the source of this update
* `supersedes`: (list-of-strings, optional) `bibliographicRecordId` that this record is a replacement for
* `commitWithin`: (integer, optional) number carried through to solr-updater, and used to indicate when SolR should commit - currently not utilized in production.

`QUERY_STRING` parameters:

* `skipQueue`: (boolean, default *false*) if the record should be put on queue to SolR after being updated
