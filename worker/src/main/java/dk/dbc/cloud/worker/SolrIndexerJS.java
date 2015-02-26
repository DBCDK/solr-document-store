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

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package dk.dbc.cloud.worker;

import dk.dbc.commons.exception.ExceptionUtil;
import dk.dbc.commons.javascript.JavaScriptWrapperSingleEnvironment;
import java.io.IOException;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
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

    @Resource(lookup="moduleSearchPath")
    String moduleSearchPath;
    @Resource(lookup="scriptFile")
    String scriptFile;
    @Resource(lookup="scriptFunction")
    String scriptFunction;

    JavaScriptWrapperSingleEnvironment wrapper;

    @PostConstruct
    public void init() {
        log.info("Create javascript wrapper with file: {}, function: {}, search path{}", new Object[] { scriptFile, scriptFunction, moduleSearchPath});
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(scriptFunction, "scriptFunction", log);
        try {
            wrapper = new JavaScriptWrapperSingleEnvironment(moduleSearchPath, scriptFile);
        }
        catch (IOException ex) {
            log.error("Initialization failed", ex);
            throw new EJBException(ex);
        }
    }

    public boolean isIndexableIdentifier(String identifier) {
        Boolean isIndexablePid = (Boolean) wrapper.callObjectFunction("isIndexablePid", identifier);
        return isIndexablePid;
    }

    public void createIndexData(String identifier, String data, SolrUpdaterCallback solrCallback) {
        wrapper.callObjectFunction(scriptFunction, identifier, data, solrCallback);

        if (solrCallback.getDeletedDocumentsCount() == 0 && solrCallback.getUpdatedDocumentsCount() == 0) {
            log.info("Indexing of {} was skipped by javascript", identifier);
        }
    }
}
