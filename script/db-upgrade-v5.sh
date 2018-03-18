#!/bin/bash -e

rm -f ${2:-dbscript_}.list

psql $1 -q -t -c 'SELECT agencyId, COUNT(*) AS c FROM bibliographicSolrKeys GROUP BY agencyId ORDER BY c DESC;' | (
	IFS=' |'
	while read a b; do
		if [ x$a = x ]; then break; fi
		echo "${0%.sh}.pl" "$1" "$a" ">${2:-log_}$a.log 2>&1" >>"${2:-dbscript_}.list"
	done
)

echo "psql $1 -c "\""ALTER TABLE bibliographicSolrKeys ADD COLUMN classifier VARCHAR(16);"\"

echo "time parallel -j16 <${2:-dbscript_}.list"
echo "psql $1 -c "\""UPDATE bibliographicSolrKeys SET classifier='UNKNOWN' WHERE classifier IS NULL;"\"
echo "psql $1 -c "\""ALTER TABLE bibliographicSolrKeys ALTER COLUMN classifier SET NOT NULL;"\"

exit 0
