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
import javax.persistence.EntityManager;
import javax.sql.DataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.QueueTestUtil.*;
import static dk.dbc.search.solrdocstore.asyncjob.AsyncJobRunnerFactory.makeAsyncJobRunner;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

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
        new DatabaseMigrator(dataSource).migrate();
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
                "foo,700000,a0", "foo,700000,a1", "foo,700000,a2",
                "foo,700000,a3", "foo,700000,a4", "foo,700000,a5",
                "foo,700000,a6", "foo,700000,a7", "foo,700000,a8",
                "foo,700000,a9",
                "foo,700000,b0", "foo,700000,b1", "foo,700000,b2",
                "foo,700000,b3", "foo,700000,b4", "foo,700000,b5",
                "foo,700000,b6", "foo,700000,b7", "foo,700000,b8",
                "foo,700000,b9",
                "foo,700000,c0", "foo,700000,c1", "foo,700000,c2",
                "foo,700000,c3", "foo,700000,c4", "foo,700000,c5",
                "foo,700000,c6", "foo,700000,c7", "foo,700000,c8",
                "foo,700000,c9",
                "foo,700001,dd");
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
                "foo,700000,a0", "foo,700000,a1", "foo,700000,a2",
                "foo,700000,a3", "foo,700000,a4", "foo,700000,a5",
                "foo,700000,a6", "foo,700000,a7", "foo,700000,a8",
                "foo,700000,a9",
                "foo,700000,b0", "foo,700000,b1", "foo,700000,b2",
                "foo,700000,b3", "foo,700000,b4", "foo,700000,b5",
                "foo,700000,b6", "foo,700000,b7", "foo,700000,b8",
                "foo,700000,b9",
                "foo,700000,c0", "foo,700000,c1", "foo,700000,c2",
                "foo,700000,c3", "foo,700000,c4", "foo,700000,c5",
                "foo,700000,c6", "foo,700000,c7", "foo,700000,c8",
                "foo,700000,c9");
    }

    private void setupData() {
        env().getPersistenceContext().run(() -> {
            for (int i = 0 ; i < 10 ; i++) {
                bibl.addBibliographicKeys(makeBiblEntity(700000, "a" + i), Collections.EMPTY_LIST);
                bibl.addBibliographicKeys(makeBiblEntity(700000, "b" + i), Collections.EMPTY_LIST);
                bibl.addBibliographicKeys(makeBiblEntity(700000, "c" + i), Collections.EMPTY_LIST);
            }
            BibliographicEntity entity = makeBiblEntity(700001, "dd");
            entity.setDeleted(true);
            bibl.addBibliographicKeys(entity, Collections.EMPTY_LIST);
        });
        clearQueue(dataSource);
    }

    private BibliographicEntity makeBiblEntity(int agencyId, String bibliographicRecordId) {
        return new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "work:-1", "unit:-1", "v0.1", false, Collections.EMPTY_MAP, "IT");
    }

}
