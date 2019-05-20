/*
 * Copyright (C) 2019 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater.rest;

import com.hazelcast.cache.impl.HazelcastServerCacheManager;
import com.hazelcast.cluster.ClusterState;
import com.hazelcast.core.Cluster;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.cache.CacheManager;
import javax.ejb.Lock;
import javax.ejb.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static javax.ejb.LockType.READ;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Singleton
@Lock(READ)
public class HazelCastStatus {

    private static final Logger log = LoggerFactory.getLogger(HazelCastStatus.class);

    @Resource(name = "payara/CacheManager")
    CacheManager manager;

    Cluster cluster;

    @PostConstruct
    public void init() {
        log.info("Initlializing hazelcast monitor");
        cluster = manager.unwrap(HazelcastServerCacheManager.class)
                .getHazelcastInstance()
                .getCluster();
    }

    private ClusterState getClusterState() {
        if (cluster == null)
            return ClusterState.FROZEN;
        ClusterState clusterState = cluster.getClusterState();
        log.debug("clusterState = {}", clusterState);
        return clusterState;
    }

    public boolean good() {
        return getClusterState() != ClusterState.FROZEN;
    }
}
