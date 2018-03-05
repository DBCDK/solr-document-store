package dk.dbc.search.solrdocstore.monitor;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
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
@Timed
@Interceptor
public class TimedInterceptor {

    private static final Logger log = LoggerFactory.getLogger(TimedInterceptor.class);

    private static final ConcurrentHashMap<Method, Timer> TIMERS = new ConcurrentHashMap<>();

    @Inject
    JmxMetrics metrics;

    @AroundInvoke
    public Object timer(InvocationContext ic) throws Exception {
        log.debug("ic = {}", ic);
        Method method = ic.getMethod();
        Timer timer = TIMERS.computeIfAbsent(method, this::makeTimer);
        try (Timer.Context time = timer.time()) {
            return ic.proceed();
        }
    }

    private Timer makeTimer(Method m) {
        String methodName = m.getName();
        Timed timed = m.getAnnotation(Timed.class);
        if (timed != null && !timed.value().isEmpty()) {
            methodName = timed.value();
        }
        String name = MetricRegistry.name(m.getDeclaringClass(), methodName);
        return metrics.getRegistry().timer(name);
    }

}
