/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
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

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Embeddable;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Embeddable
public class QueueRuleKey implements Serializable {

    private static final long serialVersionUID = 0x0433D2646AAD92BFL;

    @Column(name = "queue", updatable = false, insertable = false, nullable = false)
    private String queue;

    @Column(name = "supplier", updatable = false, insertable = false, nullable = false)
    @Convert(converter = QueueType.JPA.class)
    private QueueType supplier;

    public QueueRuleKey() {
    }

    public QueueRuleKey(String queue, QueueType supplier) {
        this.queue = queue;
        this.supplier = supplier;
    }

    @Override
    public int hashCode() {
        return Objects.hash(17, queue, supplier);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final QueueRuleKey other = (QueueRuleKey) obj;
        return Objects.equals(this.queue, other.queue) &&
               Objects.equals(this.supplier, other.supplier);
    }

    @Override
    public String toString() {
        return "QueueRuleKey{" + "queue=" + queue + ", supplier=" + supplier + '}';
    }
}
