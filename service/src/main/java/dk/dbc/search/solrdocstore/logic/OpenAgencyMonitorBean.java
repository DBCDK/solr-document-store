package dk.dbc.search.solrdocstore;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import jakarta.ejb.EJB;
import jakarta.ejb.ScheduleExpression;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.ejb.Timeout;
import jakarta.ejb.TimerConfig;
import jakarta.ejb.TimerService;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class OpenAgencyMonitorBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyMonitorBean.class);

    @Inject
    Config config;

    @Resource
    TimerService ts;

    @EJB
    OpenAgencyBean openAgency;

    @PostConstruct
    public void init() {
        int[] timeSpec = config.getOpenAgencyValidateTime();
        TimerConfig timerConfig = new TimerConfig();
        timerConfig.setPersistent(false);
        ScheduleExpression scheduleExpression = new ScheduleExpression()
                .year("*")
                .month("*")
                .dayOfMonth("*")
                .hour(timeSpec[0])
                .minute(timeSpec[1])
                .second(timeSpec[2]);

        ts.createCalendarTimer(scheduleExpression, timerConfig);
    }

    @Timeout
    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void openAgencyCacheValidation() {
        log.info("openAgencyCacheValidation");
        try {
            openAgency.verifyOpenAgencyCache();
        } catch (Exception ex) {
            log.error("Error processing openagency validation: {}", ex.getMessage());
            log.debug("Error processing openagency validation: ", ex);
        }
    }
}
