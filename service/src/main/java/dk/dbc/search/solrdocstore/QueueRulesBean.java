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

import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class QueueRulesBean {

    private static final Logger log = LoggerFactory.getLogger(QueueRulesBean.class);

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public List<QueueRuleEntity> getAllQueueRules() {
        TypedQuery<QueueRuleEntity> query = entityManager.createQuery("SELECT qr FROM QueueRuleEntity qr",
                                                                      QueueRuleEntity.class);
        return query.getResultList();
    }

    public QueueRuleEntity getQueueRule(String id) {
        return entityManager.find(QueueRuleEntity.class, id);
    }

    public void setQueueRule(QueueRuleEntity entity) {
        entityManager.merge(entity);
    }

    public void delQueueRule(QueueRuleEntity entity) {
        entityManager.remove(entity);
    }

}
