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
package dk.dbc.search.solrdocstore.jpa;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.postgresql.util.PGobject;

import dk.dbc.search.solrdocstore.Marshaller;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.SQLException;

/**
 * Handles mapping from/to String to/from PostgreSQL JSON type
 */
@Converter
public class PgHoldingsKeysToPgConverter implements AttributeConverter<IndexKeysList, PGobject> {

    private static final Marshaller MARSHALLER = new Marshaller();

    @Override
    public PGobject convertToDatabaseColumn(IndexKeysList content) throws IllegalStateException {
        final PGobject pgObject = new PGobject();
        pgObject.setType("jsonb");
        try {
            pgObject.setValue(MARSHALLER.marshall(content));
        } catch (SQLException | JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
        return pgObject;
    }

    @Override
    public IndexKeysList convertToEntityAttribute(PGobject pgObject) {
        if (pgObject == null) {
            return null;
        }
        try {
            return MARSHALLER.unmarshall(pgObject.getValue(), IndexKeysList.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }
}
