#!/bin/bash

declare -i i=0
while true; do
    eval shard='"$COREPO_SHARD'$i'"'
    
    if [ x"$shard" = x ]; then
	break
    fi
    file="$PAYARA_CFG_DIR/$((450 + i))-corepo-shard$i.jdbc"

    echo "[jdbc/corepo$i]" >"$file"
    echo '"${COREPO_SHARD'"$i"'}"' >> "$file"
    echo 'ApplicationName=${APPLICATION_NAME|MyApp}' >> "$file"
    echo 'max-pool-size = $(${POOL_SIZE|2} + 1)' >>"$file"
    echo 'steady-pool-size = 2' >>"$file"
    echo 'non-transactional-connections = true' >>"$file"
    i+=1
done
