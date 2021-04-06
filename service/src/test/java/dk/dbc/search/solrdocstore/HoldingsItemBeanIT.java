/*
 * Copyright (C) 2020 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import javax.sql.DataSource;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void enqueueWhenHoldingsItemSet() throws Exception {
        System.out.println("enqueueWhenHoldingsItemSet");
        JpaTestEnvironment env = env();

        HoldingsItemBean hol = createHoldingsItemBean(env);
        BibliographicBean bib = createBibliographicBean(env);

        env().getPersistenceContext().run(() -> {
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });
        assertThat(clearQueue(), contains( // Not postponed
                   "870970-basis:25912233=false",
                   "work:1=false"));

        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233"));
        });
        assertThat(clearQueue(), contains( // Not postponed
                   "870970-basis:25912233=false",
                   "work:1=false"));

        hol.enqueueSupplier = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(
                        new QueueRuleEntity("a", QueueType.HOLDING, 100_000),
                        new QueueRuleEntity("b", QueueType.WORK, 0));
            }
        };
        hol.enqueueSupplier.entityManager = env.getEntityManager();
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233"));
        });
        assertThat(clearQueue(), contains(
                   "870970-basis:25912233=true", // Postponed
                   "work:1=false")); // Not postponed
    }

    private HashSet<String> clearQueue() throws SQLException {
        HashSet<String> ret = new HashSet<>();
        DataSource dataSource = this.env().getDatasource();
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("DELETE FROM queue RETURNING jobid, dequeueAfter > now() AS postponed")) {
            while (resultSet.next()) {
                String jobid = resultSet.getString(1);
                boolean postponed = resultSet.getBoolean(2);
                ret.add(jobid + "=" + postponed);
            }
            return ret;
        }
    }
}
