/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(EnqueueSupplierBeanIT.class);

    @Test
    public void testEnqueueManifestationAddsToQueueTable() throws Exception {
        System.out.println("testEnqueueManifestationAddsToQueueTable");

        HashSet<String> enqueued = new HashSet<>();

        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {

            EnqueueSupplierBean bean = new EnqueueSupplierBean();
            bean.config = new Config() {
                @Override
                public List<String> getManifestationQueues() {
                    return Arrays.asList("a", "b");
                }
            };
            bean.entityManager = em;

            EnqeueService<AgencyItemKey> enqeueService = bean.getManifestationEnqueueService();

            try {
                System.out.println("* no commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "12345678"));
                System.out.println("* commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "87654321"), 100);
                System.out.println("* null commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "abc"), null);
            } catch (SQLException ex) {
                log.error("Exception: " + ex.getMessage());
                log.debug("Exception:", ex);
            }

            Connection connection = em.unwrap(java.sql.Connection.class);
            for (String sql : Arrays.asList("SELECT consumer || ',' ||  agencyid || ',' || bibliographicrecordid FROM queue WHERE commitWithin IS NULL",
                                            "SELECT consumer || ',' ||  agencyid || ',' || bibliographicrecordid || ',' || commitWithin FROM queue WHERE commitWithin IS NOT NULL")) {

            try (PreparedStatement stmt = connection.prepareStatement(sql) ;
                 ResultSet resultSet = stmt.executeQuery()) {
                while (resultSet.next()) {
                    enqueued.add(resultSet.getString(1));
                }
            } catch (SQLException ex) {
                log.error("Exception: " + ex.getMessage());
                log.debug("Exception:", ex);
            }
            }

        });

        System.out.println("enqueued = " + enqueued);
        assertThat(enqueued, containsInAnyOrder(
                   "a,870970,12345678",
                   "b,870970,12345678",
                   "a,870970,87654321,100",
                   "b,870970,87654321,100",
                   "a,870970,abc",
                   "b,870970,abc"));

    }

}