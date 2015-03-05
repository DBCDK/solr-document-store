/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package dk.dbc.cloud.worker;

import javax.ejb.Singleton;
import static net.logstash.logback.marker.Markers.append;
import net.logstash.logback.marker.ObjectAppendingMarker;

/**
 *
 * @author kasper
 */
public class LogbackHelper {
    private static final String appName = "broend-indexer-worker";
    
    public static ObjectAppendingMarker getMarker(String pid){
        
        return append("app",appName).and(
               append("pid",pid));
    }
    public static ObjectAppendingMarker getMarker(){
        
        return append("app",appName);
    }
}
