/*
 * Copyright (C) 2020 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

/**
 * RuntimeException for use with Function&lt;T,R&gt;, Consumer&lt;T&gt;,
 * Supplier&lt;R&gt;
 *
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class RethrowableException extends RuntimeException {

    public RethrowableException(Throwable cause) {
        super(cause);
    }

    /**
     * Unwraps an exception and throws it
     * <p>
     * if any cause (tracersed up) is instance of type throw that exception
     *
     * @param <T>  The wanted Exception type
     * @param type Class instance
     * @throws T Thrown if any parent exception is of this type
     */
    public <T extends Exception> void throwAs(Class<T> type) throws T {
        for (Throwable cause = getCause() ; cause != null ; cause = cause.getCause()) {
            if (type.isAssignableFrom(cause.getClass()))
                throw (T) cause;
        }
    }
}
