package dk.dbc.search.solrdocstore.updater;

import com.codahale.metrics.Counter;
import com.codahale.metrics.JmxReporter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class Metrics {
    private static final Logger log = LoggerFactory.getLogger(Metrics.class);

    private MetricRegistry metrics;
    private JmxReporter reporter;

    @PostConstruct
    public void init() {
        log.info("Starting up Metrics");
        this.metrics = new MetricRegistry();
        this.reporter = JmxReporter.forRegistry(metrics).build();
        this.reporter.start();
    }

    @PreDestroy
    public void destroy() {
        this.reporter.stop();
    }

    @Produces
    public Timer timer(InjectionPoint ip) {
        String name = ip.getMember().getName();
        if(name.endsWith("Timer")) {
            name = name.substring(0, name.length() - 5);
        }
        return metrics.timer(MetricRegistry.name(ip.getMember().getDeclaringClass(), name));
    }

    @Produces
    public Counter counter(InjectionPoint ip) {
        String name = ip.getMember().getName();
        if(name.endsWith("Counter")) {
            name = name.substring(0, name.length() - 7);
        }
        return metrics.counter(MetricRegistry.name(ip.getMember().getDeclaringClass(), name));
    }

    public MetricRegistry getMetrics() {
        return metrics;
    }


}
