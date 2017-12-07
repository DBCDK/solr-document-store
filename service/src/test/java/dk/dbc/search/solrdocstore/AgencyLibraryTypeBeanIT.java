package dk.dbc.search.solrdocstore;

import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;

public class AgencyLibraryTypeBeanIT extends JpaSolrDocStoreIntegrationTester {

    EntityManager em;

    AgencyLibraryTypeBean bean;

    @Before
    public void setupBean() {
        em = env().getEntityManager();
        bean = new AgencyLibraryTypeBean();
        bean.entityManager = em;
    }

    @Test
    public void insertFindAndDelete(){

    }
}