/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
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

import dk.dbc.search.solrdocstore.asyncjob.AsyncJobRunner;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collections;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.sql.DataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.QueueTestUtil.*;
import static dk.dbc.search.solrdocstore.asyncjob.AsyncJobRunnerFactory.makeAsyncJobRunner;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueAsyncJobIT extends JpaSolrDocStoreIntegrationTester {

    private EntityManager em;
    private DataSource dataSource;
    private BibliographicBean bibl;
    private QueueAsyncJob qaj;
    private AsyncJobRunner runner;

    public QueueAsyncJobIT() {
    }

    @Before
    public void setUp() throws SQLException {
        this.em = env().getEntityManager();
        this.dataSource = jpaTestEnvironment.getDatasource();
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE queueRule");
        }

        bibl = BeanFactoryUtil.createBibliographicBean(jpaTestEnvironment);

        runner = makeAsyncJobRunner();

        qaj = new QueueAsyncJob();
        qaj.dataSource = dataSource;
        qaj.runner = runner;
    }

    @After
    public void tearDown() {
    }

    @Test
    public void testRunQueueAllManifestationsWithDeleted() throws Exception {
        System.out.println("runQueueAllManifestationsFor");

        setupData();

        String id = qaj.runQueueAllManifestationsFor("foo", true);

        for (int i = 0 ; i < 100 ; i++) {
            if (runner.job(id).isCompleted()) {
                break;
            }
            Thread.sleep(10L);
        }

        assertThat("Job is completed", runner.job(id).isCompleted(), is(true));

        queueIs(dataSource,
                "foo,700000-clazzifier:a0", "foo,700000-clazzifier:a1", "foo,700000-clazzifier:a2",
                "foo,700000-clazzifier:a3", "foo,700000-clazzifier:a4", "foo,700000-clazzifier:a5",
                "foo,700000-clazzifier:a6", "foo,700000-clazzifier:a7", "foo,700000-clazzifier:a8",
                "foo,700000-clazzifier:a9",
                "foo,700000-clazzifier:b0", "foo,700000-clazzifier:b1", "foo,700000-clazzifier:b2",
                "foo,700000-clazzifier:b3", "foo,700000-clazzifier:b4", "foo,700000-clazzifier:b5",
                "foo,700000-clazzifier:b6", "foo,700000-clazzifier:b7", "foo,700000-clazzifier:b8",
                "foo,700000-clazzifier:b9",
                "foo,700000-clazzifier:c0", "foo,700000-clazzifier:c1", "foo,700000-clazzifier:c2",
                "foo,700000-clazzifier:c3", "foo,700000-clazzifier:c4", "foo,700000-clazzifier:c5",
                "foo,700000-clazzifier:c6", "foo,700000-clazzifier:c7", "foo,700000-clazzifier:c8",
                "foo,700000-clazzifier:c9",
                "foo,700001-clazzifier:dd");
    }

    @Test
    public void testRunQueueAllManifestationsWithoutDeleted() throws Exception {
        System.out.println("runQueueAllManifestationsFor");

        setupData();

        String id = qaj.runQueueAllManifestationsFor("foo", false);

        for (int i = 0 ; i < 100 ; i++) {
            if (runner.job(id).isCompleted()) {
                break;
            }
            Thread.sleep(10L);
        }

        assertThat("Job is completed", runner.job(id).isCompleted(), is(true));

        queueIs(dataSource,
                "foo,700000-clazzifier:a0", "foo,700000-clazzifier:a1", "foo,700000-clazzifier:a2",
                "foo,700000-clazzifier:a3", "foo,700000-clazzifier:a4", "foo,700000-clazzifier:a5",
                "foo,700000-clazzifier:a6", "foo,700000-clazzifier:a7", "foo,700000-clazzifier:a8",
                "foo,700000-clazzifier:a9",
                "foo,700000-clazzifier:b0", "foo,700000-clazzifier:b1", "foo,700000-clazzifier:b2",
                "foo,700000-clazzifier:b3", "foo,700000-clazzifier:b4", "foo,700000-clazzifier:b5",
                "foo,700000-clazzifier:b6", "foo,700000-clazzifier:b7", "foo,700000-clazzifier:b8",
                "foo,700000-clazzifier:b9",
                "foo,700000-clazzifier:c0", "foo,700000-clazzifier:c1", "foo,700000-clazzifier:c2",
                "foo,700000-clazzifier:c3", "foo,700000-clazzifier:c4", "foo,700000-clazzifier:c5",
                "foo,700000-clazzifier:c6", "foo,700000-clazzifier:c7", "foo,700000-clazzifier:c8",
                "foo,700000-clazzifier:c9");
    }

    private void setupData() {
        env().getPersistenceContext().run(() -> {
            for (int i = 0 ; i < 10 ; i++) {
                bibl.addBibliographicKeys(makeBiblEntity(700000, "a" + i), Collections.EMPTY_LIST, Optional.empty(), true);
                bibl.addBibliographicKeys(makeBiblEntity(700000, "b" + i), Collections.EMPTY_LIST, Optional.empty(), true);
                bibl.addBibliographicKeys(makeBiblEntity(700000, "c" + i), Collections.EMPTY_LIST, Optional.empty(), true);
            }
            BibliographicEntity entity = makeBiblEntity(700001, "dd");
            entity.setDeleted(true);
            bibl.addBibliographicKeys(entity, Collections.EMPTY_LIST, Optional.empty(), true);
        });
        clearQueue(dataSource);
    }

    private BibliographicEntity makeBiblEntity(int agencyId, String bibliographicRecordId) {
        return new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#1", "work:-1", "unit:-1", "v0.1", false, Collections.EMPTY_MAP, "IT");
    }

}
