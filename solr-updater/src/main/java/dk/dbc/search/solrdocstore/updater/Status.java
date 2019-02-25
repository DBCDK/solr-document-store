/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@LocalBean
@Path("/")
public class Status {

    @Inject
    Worker worker;

    @Path("/status")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response status() {
        List<String> hungThreads = worker.hungThreads();
        if (hungThreads.isEmpty()) {
            return Response.ok().entity(new Resp()).build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new Resp("hungThreads: " + hungThreads)).build();
        }
    }

    @SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
    public static class Resp {

        public boolean ok;
        public String text;

        public Resp() {
            this.ok = true;
            this.text = "Success";
        }

        public Resp(String diag) {
            this.ok = false;
            this.text = diag;
        }
    }

}
