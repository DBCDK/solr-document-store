package dk.dbc.search.solrdocstore;

import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import javax.persistence.EntityManager;

import static dk.dbc.search.solrdocstore.QueueTestUtil.clearQueue;

public class BeanFactoryUtil {

    public static BibliographicBean createBibliographicBean(JpaTestEnvironment env){
        BibliographicBean bean = new BibliographicBean();
        EntityManager em = env.getEntityManager();
        LibraryConfig config = new LibraryConfig() {
            @Override
            public LibraryType getLibraryType(int agencyId) {
                if (agencyId >= 800000) return LibraryType.NonFBS;
                if (agencyId <  400000) return LibraryType.FBSSchool;
                return LibraryType.FBS;
            }
        };
        bean.entityManager = em;
        bean.libraryConfig = config;
        bean.queue = createEnqueueSupplier(env,em);
        bean.h2bBean = createHoldingsToBibliographicBean(em,config, bean.queue);
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em, LibraryConfig config, EnqueueSupplierBean queue){
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.libraryConfig = config;
        return bean;
    }

    public static EnqueueSupplierBean createEnqueueSupplier(JpaTestEnvironment env, EntityManager entityManager){
        EnqueueSupplierBean bean = new EnqueueSupplierBean();
        bean.daemon = new QueueRulesDaemon() {
                @Override
                public Collection<String> getManifestationQueues() {
                    return Arrays.asList("a");
                }
        };
        bean.entityManager = entityManager;
        env.getPersistenceContext().run( () -> {
            clearQueue(entityManager);
        });
        return bean;
    }

    public static HoldingsItemBean createHoldingsItemBean(EntityManager em, EnqueueSupplierBean queue, HoldingsToBibliographicBean h2bBean) {
        HoldingsItemBean bean = new HoldingsItemBean();
        bean.entityManager = em;
        bean.h2bBean = h2bBean;
        bean.queue = queue;
        return bean;
    }
}
