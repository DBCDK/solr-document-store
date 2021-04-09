#!/usr/bin/python3

"""one off debug helper script: read a bibliographic solr document xml file and generate a json file for the /api/bibliographic entry point"""

import xml.etree.ElementTree
import argparse
import json

parser = argparse.ArgumentParser("")
parser.add_argument("fileName", help="input solr doc xml file")
parser.add_argument("--id",
                    help="if set change id to Id instead of filename",
                    default=None)

args = parser.parse_args()

inputFileName = args.fileName
e = xml.etree.ElementTree.parse(inputFileName).getroot()
keys = dict()

for field in e.findall('field'):
    key = field.get('name')

    if keys.get(key) is None:
        keys[key] = []
    keys[key].append(field.text)

id = inputFileName
if args.id is not None:
    id = args.id

output = {
    "id": id,
    "agencyId": 200,
    "bibliographicRecordId": "1234",
    "work": "work:1",
    "unit": "unit:2",
    "deleted": False,
    "indexKeys": keys,
    "trackingId": ""
}

outputFilename = inputFileName.replace(".xml", ".json")

with open(outputFilename, "w") as outfile:
    json.dump(output, outfile, indent=4, sort_keys=True)
