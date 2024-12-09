package dk.dbc.search.solrdocstore.monitor;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

public class MonitorApplicationIT {

    @Test
    @Timeout(value = 180, unit = TimeUnit.SECONDS)
    public void buildImage() throws Exception {
        System.out.println("buildImage");

        Docker.build();
    }
}
