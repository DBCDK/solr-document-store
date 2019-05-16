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

import com.hazelcast.cache.HazelcastCacheManager;
import com.hazelcast.cache.impl.HazelcastServerCacheManager;
import com.hazelcast.cluster.ClusterState;
import com.hazelcast.core.Cluster;
import com.hazelcast.core.HazelcastInstance;
import javax.annotation.PostConstruct;
import javax.cache.CacheManager;
import javax.ejb.Lock;
import javax.ejb.Singleton;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
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
    private Cluster cluster;

    @PostConstruct
    public void init() {
        log.info("Initlializing hazelcast monitor");
        try {
            Context ctx = new InitialContext();
            CacheManager manager = (CacheManager) ctx.lookup("payara/CacheManager");

            HazelcastCacheManager obj = manager.unwrap(HazelcastServerCacheManager.class);
            HazelcastInstance instance = obj.getHazelcastInstance();
            cluster = instance.getCluster();
        } catch (NamingException ex) {
        }
    }

    private ClusterState getClusterState() {
        if (cluster == null)
            return ClusterState.FROZEN;
        return cluster.getClusterState();
    }

    public boolean good() {
        ClusterState clusterState = getClusterState();
        log.debug("clusterState = {}", clusterState);
        return true;
    }

}
