/*
 This file is part of opensearch.
 Copyright © 2009, Dansk Bibliotekscenter a/s,
 Tempovej 7-11, DK-2750 Ballerup, Denmark. CVR: 15149043

 opensearch is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 opensearch is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with opensearch.  If not, see <http://www.gnu.org/licenses/>.
 */

package dk.dbc.cloud.worker;

import dk.dbc.jslib.Environment;
import dk.dbc.jslib.helper.JavaScriptWrapperSingleEnvironment;
import dk.dbc.openagency.client.LibraryRuleHandler;
import dk.dbc.opensearch.commons.repository.IRepositoryDAO;
import dk.dbc.opensearch.commons.repository.RepositoryInEnvironment;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import javax.annotation.PostConstruct;
import javax.ejb.EJBException;
import javax.ejb.Stateless;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 *
 */
@Stateless
public class SolrIndexerJS {
    private final static XLogger log = XLoggerFactory.getXLogger(SolrIndexerJS.class);

    private final static String MODULE_SEARCH_PATH = "classpath:javascript/ classpath:javascript/javacore/ classpath:javascript/jscommon/system/ classpath:javascript/jscommon/convert/ classpath:javascript/jscommon/devel/ classpath:javascript/jscommon/util/ classpath:javascript/jscommon/external/ classpath:javascript/jscommon/marc/ classpath:javascript/jscommon/io/ classpath:javascript/jscommon/xml/ classpath:javascript/standard-index-values/";
    private final static String JAVA_SCRIPT_FILE = "javascript/SolrIndex.js";
    private final static String JAVA_SCRIPT_FUNCTION = "createIndexData";

    private String version = "UNKNOWN";

    JavaScriptWrapperSingleEnvironment wrapper;

    @PostConstruct
    public void init() {
        log.info("Create javascript wrapper with file: {}, function: {}, search path{}", new Object[] { JAVA_SCRIPT_FILE, JAVA_SCRIPT_FUNCTION, MODULE_SEARCH_PATH});
        try {
            wrapper = new JavaScriptWrapperSingleEnvironment(MODULE_SEARCH_PATH, JAVA_SCRIPT_FILE);
        }
        catch (Exception ex) {
            log.error("Initializing {} failed", JAVA_SCRIPT_FILE );
            throw new EJBException(ex);
        }
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("/javascript/version.txt");
            if (is != null) {
                byte[] bytes = new byte[256]; // yes... version string is no longer than 256
                int len = is.read(bytes);
                version = new String(bytes, 0, len, StandardCharsets.UTF_8).trim();
                is.close();
            }
        } catch (IOException ex) {
            log.error("Error reading javascript version: {}", ex.getMessage());
            log.debug("Error reading javascript version:", ex);
        }
    }

    public boolean isIndexableIdentifier(String identifier) throws Exception {
        Boolean isIndexablePid = (Boolean) wrapper.callObjectFunction("isIndexablePid", identifier);
        return isIndexablePid;
    }

    public void createIndexData(IRepositoryDAO repository, String identifier, String data, SolrUpdaterCallback solrCallback, LibraryRuleHandler libraryRuleHandler) throws Exception {
        try {
            try ( RepositoryInEnvironment r = new RepositoryInEnvironment(getEnvironment(), repository) ) {
                wrapper.callObjectFunction(JAVA_SCRIPT_FUNCTION, identifier, data, libraryRuleHandler, solrCallback);
            }
            if (solrCallback.getDeletedDocumentsCount() == 0 && solrCallback.getUpdatedDocumentsCount() == 0) {
                log.info("Indexing of {} was skipped by javascript", identifier);
            }
        } catch( Exception e ) {
            throw new Exception( e );
        }
    }

    public Environment getEnvironment() {
        return wrapper.getEnvironment();
    }

    public String getVersion() {
        return version;
    }
}
