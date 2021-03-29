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

import java.sql.SQLException;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.postgresql.util.PGobject;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public enum QueueType {
    MANIFESTATION("manifestation", JobType.MANIFESTATION),
    MANIFESTATION_DELETED("manifestation_deleted", JobType.MANIFESTATION),
    HOLDING("holding", JobType.MANIFESTATION),
    FIRSTLASTHOLDING("firstlastholding", JobType.MANIFESTATION),
    RESOURCE("resource", JobType.MANIFESTATION),
    WORK("work", JobType.WORK),
    WORKFIRSTLASTHOLDING("workfirstlastholding", JobType.WORK);

    public enum JobType {
        MANIFESTATION,
        WORK
    }

    private final String columnValue;
    private final JobType type;

    QueueType(String columnName, JobType type) {
        this.columnValue = columnName;
        this.type = type;
    }

    public JobType getType() {
        return type;
    }

    public Predicate<QueueRuleEntity> asPredicate() {
        return qr -> this.equals(qr.getSupplier());
    }

    private static final Map<String, QueueType> LOOKUP = EnumSet.allOf(QueueType.class)
            .stream()
            .collect(Collectors.toMap(e -> e.columnValue, e -> e));

    @Converter
    public static class JPA implements AttributeConverter<QueueType, PGobject> {

        @Override
        public PGobject convertToDatabaseColumn(QueueType content) {
            final PGobject pgObject = new PGobject();
            try {
                pgObject.setType("text");
                if (content == null) {
                    pgObject.setValue(null);
                } else {
                    pgObject.setValue(content.columnValue);
                }
                return pgObject;
            } catch (SQLException ex) {
                throw new IllegalStateException(ex);
            }
        }

        @Override
        public QueueType convertToEntityAttribute(PGobject pgObject) {
            if (pgObject == null)
                return null;
            return LOOKUP.get(pgObject.getValue().toLowerCase(Locale.ROOT));
        }

    }
}
