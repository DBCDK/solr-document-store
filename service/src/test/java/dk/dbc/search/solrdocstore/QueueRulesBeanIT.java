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

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import javax.persistence.EntityManager;
import javax.sql.DataSource;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.LibraryConfig.LibraryType.NonFBS;
import static dk.dbc.search.solrdocstore.LibraryConfig.RecordType.SingleRecord;
import static dk.dbc.search.solrdocstore.QueueTestUtil.*;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueRulesBeanIT extends JpaSolrDocStoreIntegrationTester {

    private QueueRulesBean bean;
    private QueueRulesDaemon daemon;
    private BibliographicBean bibl;
    private EntityManager em;
    private DataSource dataSource;

    public QueueRulesBeanIT() {
    }

    @BeforeClass
    public static void setUpClass() {

    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() throws SQLException {
        DataSource datasource = jpaTestEnvironment.getDatasource();
        new DatabaseMigrator(datasource).migrate();
        try (Connection connection = datasource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE queueRule");
        }

        em = env().getEntityManager();
        dataSource = jpaTestEnvironment.getDatasource();

        daemon = new QueueRulesDaemon();
        daemon.dataSource = datasource;
        daemon.mes = Executors.newCachedThreadPool();
        daemon.init();

        LibraryConfig libraryConfig = new LibraryConfig() {
            @Override
            public LibraryConfig.LibraryType getLibraryType(int agency) {
                return NonFBS;
            }

            @Override
            public LibraryConfig.RecordType getRecordType(int agency) {
                return SingleRecord;
            }

        };
        bibl = new BibliographicBean();
        bibl.entityManager = em;
        bibl.queue = BeanFactoryUtil.createEnqueueSupplier(env(),em);
        bibl.h2bBean = new HoldingsToBibliographicBean();
        bibl.h2bBean.entityManager = em;
        bibl.h2bBean.libraryConfig = libraryConfig;
        bibl.libraryConfig = libraryConfig;

        bean = new QueueRulesBean();
        bean.commitEvery = 10;
        bean.dataSource = datasource;
        bean.entityManager = em;

    }

    @After
    public void tearDown() {
        daemon.destroy();
    }

    @Test
    public void persist() throws Exception {
        System.out.println("persist");
        assertThat("queuerule table is empty", getAllQueueRules().isEmpty(), is(true));
        assertNull("Non existing queue foo", getFoo());

        System.out.println(" - set foo - DO");
        env().getPersistenceContext().run(() -> bean.setQueueRule(new QueueRuleEntity("foo")));
        System.out.println(" - set foo - DONE");
        assertNotNull("queuerule for foo exists", getFoo());
        System.out.println("getAllQueueRules() = " + getAllQueueRules());
        assertThat("queuerule table is no longer empty", getAllQueueRules().isEmpty(), is(false));
        waitForQueueCountIs(1);
        assertThat("Daemon has heard about the new queue", daemon.getManifestationQueues(), contains("foo"));

        System.out.println(" - del foo - DO");
        QueueRuleEntity foo = getFoo();
        env().getPersistenceContext().run(() -> bean.delQueueRule(foo));
        System.out.println(" - del foo - DONE");
        assertNull("Non existing queue foo", getFoo());
        assertThat("queuerule table is again empty", getAllQueueRules().isEmpty(), is(true));
        waitForQueueCountIs(0);
        assertThat("Daemon has no longer knows about the queue", daemon.getManifestationQueues().isEmpty(), is(true));
    }

    @Test
    public void multipleQueues() throws Exception {
        System.out.println("multiple queues");
        assertTrue("queuerule table is empty", getAllQueueRules().isEmpty());

        System.out.println(" - set foo");
        env().getPersistenceContext().run(() -> bean.setQueueRule(new QueueRuleEntity("foo")));
        System.out.println(" - set bar");
        env().getPersistenceContext().run(() -> bean.setQueueRule(new QueueRuleEntity("bar")));
        waitForQueueCountIs(2);
        assertThat("Daemon has heard about the new queues", daemon.getManifestationQueues(), containsInAnyOrder("foo", "bar"));

        System.out.println(" - del foo");
        QueueRuleEntity foo = getFoo();
        env().getPersistenceContext().run(() -> bean.delQueueRule(foo));

        waitForQueueCountIs(1);
        assertThat("Daemon has forgotten about foo", daemon.getManifestationQueues(), not(containsInAnyOrder("foo")));
        assertThat("Daemon still knows about bar", daemon.getManifestationQueues(), containsInAnyOrder("bar"));
    }

    @Test
    public void enqueueAll() throws Exception {
        System.out.println("enqueueAll");

        clearQueue(dataSource);
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
        bean.queueAllManifestations("foo");
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
    public void enqueueNotDeleted() throws Exception {
        System.out.println("enqueueNotDeleted");

        clearQueue(dataSource);
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
        bean.queueNotDeletedManifestations("foo");
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

    public void waitForQueueCountIs(int count) throws InterruptedException {
        for (int i = 0 ; i < 1000 ; i++) {
            if (daemon.getManifestationQueues().size() == count) {
                break;
            }
            Thread.sleep(1L);
        }
    }

    private QueueRuleEntity getFoo() {
        return env().getPersistenceContext().run(() -> bean.getQueueRule("foo"));
    }

    private List<QueueRuleEntity> getAllQueueRules() {
        return env().getPersistenceContext().run(bean::getAllQueueRules);
    }

    private BibliographicEntity makeBiblEntity(int agencyId, String bibliographicRecordId) {
        return new BibliographicEntity(agencyId, bibliographicRecordId, "work:-1", "unit:-1", "v0.1", false, Collections.EMPTY_MAP, "IT");
    }

}
