package dk.dbc.search.solrdocstore.monitor;

import com.codahale.metrics.Meter;
import com.codahale.metrics.MetricRegistry;
import java.lang.reflect.Method;
import java.util.concurrent.ConcurrentHashMap;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Metered
@Interceptor
public class MeteredInterceptor {

    private static final Logger log = LoggerFactory.getLogger(MeteredInterceptor.class);

    private static final ConcurrentHashMap<Method, Meter> METERS = new ConcurrentHashMap<>();

    @Inject
    JmxMetrics metrics;

    @AroundInvoke
    public Object timer(InvocationContext ic) throws Exception {
        Method method = ic.getMethod();
        Meter meter = METERS.computeIfAbsent(method, this::makeMeter);
        meter.mark();
        return ic.proceed();
    }

    private Meter makeMeter(Method method) {
        log.debug("method = {}", method);
        String methodName = method.getName();
        Metered metered = method.getAnnotation(Metered.class);
        if (metered != null && !metered.value().isEmpty()) {
            methodName = metered.value();
        }
        String name = MetricRegistry.name(method.getDeclaringClass(), methodName);
        return metrics.getRegistry().meter(name);
    }

}
