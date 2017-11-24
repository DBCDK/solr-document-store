/*
 * DataIO - Data IO
 * Copyright (C) 2015 Dansk Bibliotekscenter a/s, Tempovej 7-11, DK-2750 Ballerup,
 * Denmark. CVR: 15149043
 *
 * This file is part of DataIO.
 *
 * DataIO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DataIO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DataIO.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.postgresql.util.PGobject;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles mapping from/to String to/from PostgreSQL JSON type
 */
@Converter
public class PgMapOfStringsToJsonConverter implements AttributeConverter<Map<String, List<String>>, PGobject> {

    private final JSONBContext context = new JSONBContext();

    @Override
    public PGobject convertToDatabaseColumn(Map<String, List<String>> content) throws IllegalStateException {
        final PGobject pgObject = new PGobject();
        pgObject.setType("jsonb");
        try {

            pgObject.setValue(context.marshall(content));
        } catch (SQLException | JSONBException e) {
            throw new IllegalStateException(e);
        }
        return pgObject;
    }

    @Override
    public Map<String, List<String>> convertToEntityAttribute(PGobject pgObject) {
        if (pgObject == null) {
            return null;
        }
        Map<String, List<String>> res = null;
        try {
            res = context.unmarshall(pgObject.getValue(), HashMap.class);
        } catch (JSONBException e) {
            throw new IllegalStateException(e);
        }
        return res;
    }
}
