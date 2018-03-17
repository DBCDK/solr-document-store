#!/bin/bash -e

rm -f ${2:-dbscript_}all.list

psql $1 -q -t -c 'SELECT agencyId, COUNT(*) AS c FROM bibliographicSolrKeys GROUP BY agencyId ORDER BY c DESC;' | (
	IFS=' |'
	while read a b; do
		if [ x$a = x ]; then break; fi
		sed -e '1,/^__DATA__/d' \
			-e "s/@AGENCYID@/$a/g" \
			$0 > "${2:-dbscript_}$a.sql"
		echo "psql" "$1" "<${2:-dbscript_}$a.sql" >>"${2:-dbscript_}all.list"
	done
)


echo "time parallel -j16 <${2:-dbscript_}all.list"
echo "psql $1 -c "\""UPDATE bibliographicSolrKeys SET classifier='UNKNOWN' WHERE classifier IS NULL;"\"

exit 0




__DATA__
BEGIN;
DO
$$
DECLARE
    cnt NUMERIC(12);
    cls VARCHAR(16);
    done BOOLEAN;
BEGIN
    FOR cls, cnt IN SELECT indexkeys#>>'{original_format,0}' AS cls, count(*) FROM bibliographicsolrkeys WHERE agencyid=@AGENCYID@ AND NOT deleted GROUP BY cls ORDER BY cls LOOP
        RAISE NOTICE 'agency=%(%), classifier=%', @AGENCYID@, cnt, cls;
        UPDATE bibliographicSolrKeys SET classifier=cls WHERE agencyId=@AGENCYID@ AND indexkeys#>>'{original_format,0}' = cls;
    END LOOP;
END
$$;
COMMIT;
