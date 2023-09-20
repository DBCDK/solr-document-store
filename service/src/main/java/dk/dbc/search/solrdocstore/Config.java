package dk.dbc.search.solrdocstore;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.EJBException;
import jakarta.ejb.Startup;
import jakarta.ejb.Stateless;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private String systemName;
    private int[] openAgencyValidateTime;
    private String vipCoreEndpoint;
    private long reviveOlderWhenDeletedForAtleast;

    public Config() {
        loadPropertied(System.getenv());
    }

    public Config(Map<String, String> env) {
        loadPropertied(env);
    }

    private void loadPropertied(Map<String, String> env) {
        // Name displayed in frontend to tell the user which system they are looking at (FBSTest, Cisterne etc.)
        systemName = getValue(env, "SYSTEM_NAME", "System navn ikke konfigureret", null);
        openAgencyValidateTime = getValue(env, "OPEN_AGENCY_VALIDATE_TIME", "04:23:17", null, Config::validateTime);
        vipCoreEndpoint = getValue(env, "VIPCORE_ENDPOINT", "http://vipcore.iscrum-vip-staging.svc.cloud.dbc.dk", "No URL found for VipCore");
        reviveOlderWhenDeletedForAtleast = getValue(env, "REVIVE_OLDER_WHEN_DELETED_FOR_ATLEAST", "8h", null, Config::ms);
    }

    public String getVipCoreEndpoint() {
        return vipCoreEndpoint;
    }

    public String getSystemName() {
        return systemName;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public int[] getOpenAgencyValidateTime() {
        return openAgencyValidateTime;
    }

    public long getReviveOlderWhenDeletedForAtleast() {
        return reviveOlderWhenDeletedForAtleast;
    }

    private static String getValue(Map<String, String> env, String name, String defaultValue, String error) {
        String value = env.get(name);
        if (value == null) {
            value = defaultValue;
        }
        if (value == null) {
            throw new EJBException(error + ". " +
                                   "Please provide env:" + name);
        }
        return value;
    }

    private static <T> T getValue(Map<String, String> env, String name, String defaultValue, String error, Function<String, T> mapper) {
        return mapper.apply(getValue(env, name, defaultValue, error));
    }

    private static int[] validateTime(String time) {
        String[] parts = time.split(":");
        try {
            if (parts.length == 3) {
                int[] ret = new int[3];

                for (int i = 0 ; i < 3 ; i++) {
                    if (parts[i].isEmpty()) {
                        throw new IllegalArgumentException("Empty part");
                    }
                    ret[i] = Integer.parseUnsignedInt(parts[i], 10);
                }
                return ret;
            }
        } catch (RuntimeException ex) {
            log.error("Error processing time: {}", ex.getMessage());
            log.debug("Error processing time: ", ex);
        }
        throw new IllegalArgumentException("Invalid time: " + time);
    }

    private static final Pattern MS = Pattern.compile("(0|[1-9]\\d*)\\s*(\\D+)");

    public static long ms(String duration) {
        Matcher matcher = MS.matcher(duration);
        if (!matcher.matches()) {
            throw new EJBException("Duration: '" + duration + "' is not of format {number}{unit}");
        }
        long amount = Long.parseLong(matcher.group(1));
        switch (matcher.group(2).toLowerCase(Locale.ROOT).trim()) {
            case "d":
            case "day":
            case "days":
                return TimeUnit.DAYS.toMillis(amount);
            case "h":
            case "hour":
            case "hours":
                return TimeUnit.HOURS.toMillis(amount);
            case "m":
            case "min":
            case "mins":
            case "minute":
            case "minutes":
                return TimeUnit.MINUTES.toMillis(amount);
            case "s":
            case "sec":
            case "secs":
            case "second":
            case "seconds":
                return TimeUnit.SECONDS.toMillis(amount);
            case "ms":
            case "milli":
            case "millis":
            case "millisecond":
            case "milliseconds":
                return TimeUnit.MILLISECONDS.toMillis(amount);
            default:
                throw new EJBException("Duration: '" + duration + "' with unknown unit (ms/s/m)");
        }
    }

}
