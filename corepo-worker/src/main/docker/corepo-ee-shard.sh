#!/bin/bash

declare -i i=0
while true; do
    eval shard='"$COREPO_SHARD'$i'"'
    
    if [ x"$shard" = x ]; then
	break
    fi
    file="$PAYARA_CFG/post/$((450 + i))-corepo-shard.jdbc"
    echo "[jdbc/corepo$i/pool]" >"$file"
    echo "postgres" >>"$file"
    echo "nonTransactionalConnections = true" >>"$file"
    echo "[properties]" >>"$file"
    echo "$shard" >>"$file"
    echo "[jdbc/corepo$i]" >>"$file"
    i+=1
done
