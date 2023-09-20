package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.logic.BibliographicResourceRetrieveBean;
import dk.dbc.search.solrdocstore.logic.BibliographicRetrieveBean;
import dk.dbc.search.solrdocstore.logic.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.logic.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyProxyBean;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;
import dk.dbc.search.solrdocstore.v2.DocumentRetrieveBeanV2;
import dk.dbc.search.solrdocstore.v2.ExistenceBeanV2;
import dk.dbc.search.solrdocstore.v2.HoldingsItemBeanV2;
import dk.dbc.search.solrdocstore.v2.OpenAgencyStatusBeanV2;
import dk.dbc.search.solrdocstore.v2.QueueBeanV2;
import dk.dbc.search.solrdocstore.v2.ResourceBeanV2;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class BeanFactory {

    private final EntityManager em;
    private final Config config;

    private static final List<String> DEFAULT_CONFIG = List.of("SYSTEM_NAME=test-system",
                                                               "VIPCORE_ENDPOINT=http://localhost:-1/",
                                                               "REVIVE_OLDER_WHEN_DELETED_FOR_ATLEAST=1h");

    public BeanFactory(EntityManager em) {
        this.em = em;
        Map<String, String> env = DEFAULT_CONFIG.stream()
                .map(s -> s.split("=", 2))
                .collect(Collectors.toMap(a -> a[0], a -> a[1], (l, r) -> r));
        this.config = new Config(env);
    }

    private final Bean<BibliographicBeanV2> bibliographicBeanV2 = new Bean<>(BibliographicBeanV2::new, this::bibliographicBeanV2Init);

    private void bibliographicBeanV2Init(BibliographicBeanV2 bean) {
        bean.entityManager = em;
        bean.config = config;
        bean.brBean = bibliographicRetrieveBean();
        bean.enqueueSupplier = enqueueSupplierBean();
        bean.h2bBean = holdingsToBibliographicBean();
        bean.openAgency = openAgencyBean();
    }

    public void bibliographicBeanV2(BibliographicBeanV2 obj) {
        bibliographicBeanV2.set(obj);
    }

    public BibliographicBeanV2 bibliographicBeanV2() {
        return bibliographicBeanV2.get();
    }

    private final Bean<BibliographicRecordAPIBeanV2> bibliographicRecordAPIBeanV2 = new Bean<>(BibliographicRecordAPIBeanV2::new, this::bibliographicRecordAPIBeanV2Init);

    private void bibliographicRecordAPIBeanV2Init(BibliographicRecordAPIBeanV2 bean) {
        bean.entityManager = em;
        bean.brBean = bibliographicRetrieveBean();
    }

    public void bibliographicRecordAPIBeanV2(BibliographicRecordAPIBeanV2 obj) {
        bibliographicRecordAPIBeanV2.set(obj);
    }

    public BibliographicRecordAPIBeanV2 bibliographicRecordAPIBeanV2() {
        return bibliographicRecordAPIBeanV2.get();
    }

    private final Bean<BibliographicResourceRetrieveBean> bibliographicResourceRetrieveBean = new Bean<>(BibliographicResourceRetrieveBean::new, this::bibliographicResourceRetrieveBeanInit);

    private void bibliographicResourceRetrieveBeanInit(BibliographicResourceRetrieveBean bean) {
        bean.entityManager = em;
    }

    public void bibliographicResourceRetrieveBean(BibliographicResourceRetrieveBean obj) {
        bibliographicResourceRetrieveBean.set(obj);
    }

    public BibliographicResourceRetrieveBean bibliographicResourceRetrieveBean() {
        return bibliographicResourceRetrieveBean.get();
    }

    private final Bean<BibliographicRetrieveBean> bibliographicRetrieveBean = new Bean<>(BibliographicRetrieveBean::new, this::bibliographicRetrieveBeanInit);

    private void bibliographicRetrieveBeanInit(BibliographicRetrieveBean bean) {
        bean.entityManager = em;
    }

    public void bibliographicRetrieveBean(BibliographicRetrieveBean obj) {
        bibliographicRetrieveBean.set(obj);
    }

    public BibliographicRetrieveBean bibliographicRetrieveBean() {
        return bibliographicRetrieveBean.get();
    }

    private final Bean<DocumentRetrieveBeanV2> documentRetrieveBeanV2 = new Bean<>(DocumentRetrieveBeanV2::new, this::documentRetrieveBeanV2Init);

    private void documentRetrieveBeanV2Init(DocumentRetrieveBeanV2 bean) {
        bean.entityManager = em;
        bean.brBean = bibliographicRetrieveBean();
        bean.brrBean = bibliographicResourceRetrieveBean();
        bean.oaBean = openAgencyBean();
    }

    public void documentRetrieveBeanV2(DocumentRetrieveBeanV2 obj) {
        documentRetrieveBeanV2.set(obj);
    }

    public DocumentRetrieveBeanV2 documentRetrieveBeanV2() {
        return documentRetrieveBeanV2.get();
    }

    private final Bean<EnqueueSupplierBean> enqueueSupplierBean = new Bean<>(EnqueueSupplierBean::new, this::enqueueSupplierBeanInit);

    private void enqueueSupplierBeanInit(EnqueueSupplierBean bean) {
        bean.entityManager = em;
    }

    public BeanFactory enqueueSupplierBean(EnqueueSupplierBean bean) {
        enqueueSupplierBean.set(bean);
        return this;
    }

    public EnqueueSupplierBean enqueueSupplierBean() {
        return enqueueSupplierBean.get();
    }

    private final Bean<ExistenceBeanV2> existenceBeanV2 = new Bean<>(ExistenceBeanV2::new, this::existenceBeanV2Init);

    private void existenceBeanV2Init(ExistenceBeanV2 bean) {
        bean.entityManager = em;
    }

    public BeanFactory existenceBeanV2(ExistenceBeanV2 bean) {
        existenceBeanV2.set(bean);
        return this;
    }

    public ExistenceBeanV2 existenceBeanV2() {
        return existenceBeanV2.get();
    }

    private final Bean<HoldingsItemBeanV1> holdingsItemBeanV1 = new Bean<>(HoldingsItemBeanV1::new, this::holdingsItemBeanV1Init);

    private void holdingsItemBeanV1Init(HoldingsItemBeanV1 bean) {
        bean.entityManager = em;
        bean.brBean = bibliographicRetrieveBean();
        bean.enqueueSupplier = enqueueSupplierBean();
        bean.h2bBean = holdingsToBibliographicBean();
    }

    public void holdingsItemBeanV1(HoldingsItemBeanV1 obj) {
        holdingsItemBeanV1.set(obj);
    }

    public HoldingsItemBeanV1 holdingsItemBeanV1() {
        return holdingsItemBeanV1.get();
    }

    private final Bean<HoldingsItemBeanV2> holdingsItemBeanV2 = new Bean<>(HoldingsItemBeanV2::new, this::holdingsItemBeanV2Init);

    private void holdingsItemBeanV2Init(HoldingsItemBeanV2 bean) {
        bean.entityManager = em;
        bean.brBean = bibliographicRetrieveBean();
        bean.enqueueSupplier = enqueueSupplierBean();
        bean.h2bBean = holdingsToBibliographicBean();
    }

    public void holdingsItemBeanV2(HoldingsItemBeanV2 obj) {
        holdingsItemBeanV2.set(obj);
    }

    public HoldingsItemBeanV2 holdingsItemBeanV2() {
        return holdingsItemBeanV2.get();
    }

    private final Bean<HoldingsToBibliographicBean> holdingsToBibliographicBean = new Bean<>(HoldingsToBibliographicBean::new, this::holdingsToBibliographicBeanInit);

    private void holdingsToBibliographicBeanInit(HoldingsToBibliographicBean bean) {
        bean.em = em;
        bean.openAgency = openAgencyBean();
        bean.brBean = bibliographicRetrieveBean();
    }

    public void holdingsToBibliographicBean(HoldingsToBibliographicBean obj) {
        holdingsToBibliographicBean.set(obj);
    }

    public HoldingsToBibliographicBean holdingsToBibliographicBean() {
        return holdingsToBibliographicBean.get();
    }

    private final Bean<OpenAgencyBean> openAgencyBean = new Bean<>(OpenAgencyBean::new, this::openAgencyBeanInit);

    private void openAgencyBeanInit(OpenAgencyBean bean) {
        bean.entityManager = em;
        bean.proxy = openAgencyProxyBean();
    }

    public void openAgencyBean(OpenAgencyBean obj) {
        openAgencyBean.set(obj);
    }

    public OpenAgencyBean openAgencyBean() {
        return openAgencyBean.get();
    }

    private final Bean<OpenAgencyProxyBean> openAgencyProxyBean = new Bean<>(OpenAgencyProxyBean::new, this::openAgencyProxyBeanInit);

    private void openAgencyProxyBeanInit(OpenAgencyProxyBean bean) {
    }

    public void openAgencyProxyBean(OpenAgencyProxyBean obj) {
        openAgencyProxyBean.set(obj);
    }

    public OpenAgencyProxyBean openAgencyProxyBean() {
        return openAgencyProxyBean.get();
    }

    private final Bean<OpenAgencyStatusBeanV2> openAgencyStatusBeanV2 = new Bean<>(OpenAgencyStatusBeanV2::new, this::openAgencyStatusBeanV2Init);

    private void openAgencyStatusBeanV2Init(OpenAgencyStatusBeanV2 bean) {
        bean.entityManager = em;
        bean.proxy = openAgencyProxyBean();
        bean.supplier = enqueueSupplierBean();
    }

    public void openAgencyStatusBeanV2(OpenAgencyStatusBeanV2 obj) {
        openAgencyStatusBeanV2.set(obj);
    }

    public OpenAgencyStatusBeanV2 openAgencyStatusBeanV2() {
        return openAgencyStatusBeanV2.get();
    }

    private final Bean<QueueBeanV2> queueBeanV2 = new Bean<>(QueueBeanV2::new, this::queueBeanV2Init);

    private void queueBeanV2Init(QueueBeanV2 bean) {
        bean.entityManager = em;
        bean.enqueueSupplier = enqueueSupplierBean();
    }

    public void queueBeanV2(QueueBeanV2 obj) {
        queueBeanV2.set(obj);
    }

    public QueueBeanV2 queueBeanV2() {
        return queueBeanV2.get();
    }

    private final Bean<ResourceBeanV2> resourceBeanV2 = new Bean<>(ResourceBeanV2::new, this::resourceBeanV2Init);

    private void resourceBeanV2Init(ResourceBeanV2 bean) {
        bean.entityManager = em;
        bean.enqueueSupplier = enqueueSupplierBean();
        bean.openAgency = openAgencyBean();
    }

    public void resourceBeanV2(ResourceBeanV2 obj) {
        resourceBeanV2.set(obj);
    }

    public ResourceBeanV2 resourceBeanV2() {
        return resourceBeanV2.get();
    }

    private static class Bean<T> {

        private final Supplier<T> maker;
        private final Consumer<T> initializer;

        private T obj;
        private boolean initlialized = false;

        private Bean(Supplier<T> maker, Consumer<T> initializer) {
            this.maker = maker;
            this.initializer = initializer;
        }

        private void set(T obj) {
            if (initlialized)
                throw new IllegalStateException("Cannot set bean instances after a bean has been initialized");
            this.obj = obj;
        }

        private T get() {
            if (obj == null)
                obj = maker.get();
            if (!initlialized) {
                initlialized = true;
                initializer.accept(obj);
            }
            return obj;
        }

    }
}
