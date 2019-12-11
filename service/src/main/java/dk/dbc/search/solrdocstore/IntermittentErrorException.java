/*
 * Copyright (C) 2019 DBC A/S (http://dbc.dk/)
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

/**
 * This is a try again later error
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class IntermittentErrorException extends RuntimeException {

    public IntermittentErrorException() {
    }

    public IntermittentErrorException(String message) {
        super(message);
    }

    public IntermittentErrorException(String message, Throwable cause) {
        super(message, cause);
    }

    public IntermittentErrorException(Throwable cause) {
        super(cause);
    }

    public IntermittentErrorException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
