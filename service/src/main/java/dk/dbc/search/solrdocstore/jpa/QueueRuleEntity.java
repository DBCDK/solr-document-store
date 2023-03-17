package dk.dbc.search.solrdocstore.jpa;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "queueRule")
public class QueueRuleEntity implements Serializable {

    private static final long serialVersionUID = 0x5DF7F2B355D4530EL;

    public QueueRuleEntity() {
        this.pk = new QueueRuleKey();
    }

    public QueueRuleEntity(String queue, QueueType supplier, int postpone) {
        this.queue = queue;
        this.supplier = supplier;
        this.postpone = postpone;
        this.pk = new QueueRuleKey(queue, supplier);
    }

    @EmbeddedId
    @SuppressWarnings("PMD.UnusedPrivateField")
    private QueueRuleKey pk;

    @Column(name = "queue", updatable = false, nullable = false)
    private String queue;

    @Column(name = "supplier", updatable = false, nullable = false)
    @Convert(converter = QueueType.JPA.class)
    private QueueType supplier;

    @Column(name = "postpone", updatable = false, nullable = false)
    private int postpone;

    @Override
    public int hashCode() {
        return Objects.hash(57, queue, supplier, postpone);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final QueueRuleEntity other = (QueueRuleEntity) obj;
        return Objects.equals(this.queue, other.queue) &&
               Objects.equals(this.supplier, other.supplier) &&
               this.postpone == other.postpone;
    }

    @Override
    public String toString() {
        return "QueueRuleEntity{" + "queue=" + queue + ", supplier=" + supplier + ", postpone=" + postpone + '}';
    }

    public String getQueue() {
        return queue;
    }

    public void setQueue(String queue) {
        this.queue = queue;
    }

    public QueueType getSupplier() {
        return supplier;
    }

    public void setSupplier(QueueType supplier) {
        this.supplier = supplier;
    }

    public int getPostpone() {
        return postpone;
    }

    public void setPostpone(int postpone) {
        this.postpone = postpone;
    }
}
