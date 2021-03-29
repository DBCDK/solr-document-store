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

import java.util.EnumSet;
import java.util.Locale;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public enum QueueType {
    MANIFESTATION("manifestation"),
    HOLDING("holding"),
    FIRSTLASTHOLDING("firstlastholding"),
    WORK("work"),
    WORKFIRSTLASTHOLDING("workfirstlastholding");

    private final String columnName;

    QueueType(String columnName) {
        this.columnName = columnName;
    }

    public String getColumnName() {
        return columnName;
    }

    public Predicate<QueueRuleEntity> asPredicate() {
        return qr -> {
            return columnName.equals(qr.getSupplier());
        };
    }

    private static final Map<String, QueueType> LOOKUP = EnumSet.allOf(QueueType.class)
            .stream()
            .collect(Collectors.toMap(e -> e.columnName, e -> e));

    public static QueueType fromColumnName(String text) {
        return LOOKUP.get(text.toLowerCase(Locale.ROOT));
    }

}
