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
package dk.dbc.search.solrdocstore.asyncjob;

import dk.dbc.search.solrdocstore.Config;
import java.util.concurrent.Executors;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class AsyncJobRunnerFactory {

    public static AsyncJobRunner makeAsyncJobRunner() {
        AsyncJobRunner runner = new AsyncJobRunner();
        runner.config = new Config() {
            @Override
            public long getJobPruneMinutes() {
                return 1L;
            }
        };
        runner.sessionHandler = new AsyncJobSessionHandler();
        runner.init();
        runner.mes = Executors.newCachedThreadPool();
        return runner;
    }
}
