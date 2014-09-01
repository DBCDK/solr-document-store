/*
 * Copyright (C) 2014 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-cloud-indexer
 *
 * Solr-cloud-indexer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Solr-cloud-indexer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package dk.dbc.cloud.worker;

import com.codahale.metrics.JmxReporter;
import com.codahale.metrics.MetricRegistry;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Singleton;

@Singleton
public class MetricsRegistry {

    private final MetricRegistry metrics = new MetricRegistry();

    private JmxReporter reporter;

    @PostConstruct
    public void create() {
        reporter = JmxReporter.forRegistry(metrics).build();
        reporter.start();
    }

    @PreDestroy
    public void destroy() {
        if (reporter != null) {
            reporter.stop();
        }
    }

    public MetricRegistry getRegistry() {
        return metrics;
    }
}
