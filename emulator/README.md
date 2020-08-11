# SolrDocStoreEmulator

Use this service in the framework for setting up experimental search frameworks. 
The intention is that it can be used as a "dummy implementation" of components that users of the framework 
can implement themselves.

As it stands, it simply forwards requests to a solr-doc-store service and returns whatever that service returns.
Therefore, you need to specify the URL of the solr-doc-store service you wish to use for that.

## Example usage

First, build with `maven`. Change to the `emulator` folder and do:
```bash
mvn clean package
```

Then, build a docker image:
```bash
docker build -t nots/solr-doc-store-emulator -f target/docker/Dockerfile .
```

You are then ready to run the component with a command resembling this:
```bash
docker run -e SOLR_DOC_STORE_URL=$SOLR_DOC_STORE_URL -e JAVA_MAX_HEAP_SIZE=2g -ti -e LOG_LEVEL=debug -e LOG-FORMAT=text -p 8090:8080 nots/solr-doc-store-emulator:latest
```

where you have set an environment variable `$SOLR_DOC_STORE_URL` to a "real" solr-doc-store url. 
This could be on a local dit system, for example. 
Don't set it to a production system URL unless you know what you are doing!

When the service is running, you can test it with `curl`, like this:
```bash
curl -X POST -H "Content-Type: application/json" -d @bib.json http://localhost:8090/solr-doc-store-emulator-1.0-SNAPSHOT/api/bibliographic
```

where the `bib.json` file looks like this.
```json
{
    "agencyId": "010100",
    "classifier": "classifier:1",
    "bibliographicRecordId": "45454545",
    "repositoryId": "repo",
    "work": "work:1",
    "unit": "unit:1",
    "producerVersion": "producer:1",
    "deleted": "false",
    "indexKeys": {},
    "trackingId": "track1"
}
```