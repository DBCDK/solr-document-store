
package dk.dbc.cloud.worker;

import dk.dbc.solr.indexer.cloud.shared.SleepHandler;
import javax.ejb.Lock;
import static javax.ejb.LockType.READ;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

@Startup
@Singleton
@TransactionManagement( TransactionManagementType.BEAN )
public class AdjacentFailureHandler {
    SleepHandler sleepHandler = new SleepHandler()
                                .withLowerLimit( 5, 1000 )      //adjacent failures > 5 -> sleep 1s
                                .withLowerLimit( 10, 10000 )    //adjacent failures > 10 -> sleep 10s
                                .withLowerLimit( 100, 60000 );  //adjacent failures > 100 -> sleep 60s
    
    @Lock(READ)
    public void failure() {
        sleepHandler.failure();
    }
    
    @Lock(READ)
    public void reset() {
        sleepHandler.reset();
    }
}
