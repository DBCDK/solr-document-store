#!/usr/bin/python3

"""
  one off debug helper script: read a bibliographic solr document xml file and generate a json file for the /api/holdings entry point

  Scan a list of solr documents in xml and extract sample solr-doc-store holdings update .json documents.
  if bib and faust is not given.. it is taken from the .xml file
"""

import xml.etree.ElementTree
import argparse
import json

parser = argparse.ArgumentParser("")
parser.add_argument("fileName", help="input solr doc xml file", nargs='+')
parser.add_argument("--bib", help="only look for bib", default=None)
parser.add_argument("--faust", help="only look for bib", default=None)

args = parser.parse_args()

for f in args.fileName:
    print(f)


def create_single_element(input_file_name):
    e = xml.etree.ElementTree.parse(input_file_name).getroot()
    keys = dict()

    for field in e.findall('field'):
        key = field.get('name')

        if keys.get(key) is None:
            keys[key] = []
        keys[key].append(field.text)

    return keys


global_agencyId = args.bib
global_bibliographicRecordId = args.faust

subDocuments = []
for f in args.fileName:
    keys = create_single_element(f)
    cur_agencyId = keys['holdingsitem.agencyId']
    cur_bibliographicRecordId = keys['holdingsitem.bibliographicRecordId']

    if global_agencyId is None:
        print("Using : ", cur_agencyId, ":", cur_bibliographicRecordId)
        global_agencyId = cur_agencyId
        global_bibliographicRecordId = cur_bibliographicRecordId

    if cur_agencyId == global_agencyId and cur_bibliographicRecordId == global_bibliographicRecordId:
        subDocuments.append(keys)
    else:
        print("Ignored file ", f, " ", cur_agencyId, "!=", global_agencyId, " ", cur_bibliographicRecordId, " != ", global_bibliographicRecordId)

print("documents found ", len(subDocuments))

output = {
    "agencyId": global_agencyId,
    "bibliographicRecordId": global_bibliographicRecordId,
    "indexKeys": subDocuments,
    "trackingId": ""
}

outputFilename = "%s-%s.json"%(global_agencyId, global_bibliographicRecordId)

print(outputFilename)
with open(outputFilename, "w") as outfile:
    json.dump(output, outfile, indent=4, sort_keys=True)
