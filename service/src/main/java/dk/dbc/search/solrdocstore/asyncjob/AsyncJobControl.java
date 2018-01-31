/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.asyncjob;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.function.Supplier;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("async-job")
public class AsyncJobControl {

    private static final Logger log = LoggerFactory.getLogger(AsyncJobControl.class);

    @Inject
    AsyncJobRunner runner;

    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("testjob/{count : \\d+}/{sleep : \\d+}")
    public Response test(@PathParam("count") int count,
                         @PathParam("sleep") int sleep) {
        int sleepMs = Integer.max(sleep, 100);
        String id = runner.start(new AsyncJob("testjob") {

            @Override
            public void run(Supplier<Boolean> isCanceled) throws Exception {
                for (int i = 0 ; i < count ; i++) {
                    if (isCanceled.get()) {
                        break;
                    }
                    log.debug(UUID.randomUUID().toString());
                    if (i % 20 == 0) {
                        log.info("TICK");
                    } else if (i % 20 == 10) {
                        log.info("TOCK");
                    }
                    Thread.sleep(sleepMs);
                }
            }

        });
        return Response.ok(id).build();
    }

    /**
     * List current jobs
     *
     * @return map of uuid to job name
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("jobs")
    public Response jobs() {
        return Response.ok().entity(runner.jobs()).build();
    }

    /**
     * Cancel a running job
     *
     * @param id uuid of job
     * @return empty string or Not Found
     */
    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("cancel/{id : .+}")
    public Response cancel(@PathParam("id") @NotNull String id) {
        AsyncJobHandle job = runner.job(id);
        if (job == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        job.cancel();
        return Response.ok().build();
    }

    /**
     * Get the last 8k of the log file
     *
     * @param id uuid of job
     * @return bytes
     */
    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("tail/{id}")
    public Response tail(@PathParam("id") @NotNull String id) {
        return tail(id, 8 /* 8k */);
    }

    /**
     * Get the last (n)k of the log file
     *
     * @param id   uuid of job
     * @param size number of k
     * @return bytes
     */
    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("tail/{id}/{size : \\d+}")
    public Response tail(@PathParam("id") @NotNull String id,
                         @PathParam("size") @NotNull Integer size) {
        AsyncJobHandle job = runner.job(id);
        if (job == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (job.isStarted()) {
            return Response.ok().entity(job.tail(1024 * size)).build();
        } else {
            return Response.ok().entity("Not Started").build();
        }
    }

    /**
     * get the entire logfile (so far)
     *
     * @param id uuid of job
     * @return bytes
     */
    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("log/{id}")
    public Response log(@PathParam("id") @NotNull String id) {
        AsyncJobHandle job = runner.job(id);
        if (job == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (job.isStarted()) {
            return Response.ok().entity(job.content()).build();
        } else {
            return Response.ok().entity("Not Started").build();
        }
    }

    /**
     * Get status of job
     *
     * @param id uuid of job
     * @return json structure {@link StatusResponse}
     */
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("status/{id}")
    public Response status(@PathParam("id") @NotNull String id) {
        AsyncJobHandle job = runner.job(id);
        if (job == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok().entity(new StatusResponse(job)).build();
    }

    @XmlRootElement
    public static class StatusResponse {

        public boolean running, started, canceled, completed;
        public String startedAt, completedAt, name;

        public StatusResponse() {
        }

        public StatusResponse(AsyncJobHandle job) {
            running = job.isRunning();
            started = job.isStarted();
            canceled = job.isCanceled();
            completed = job.isCompleted();
            name = job.getJob().getName();
            Instant startedAtTime = job.getStartedAt();
            if (startedAtTime == null) {
                startedAt = null;
            } else {
                startedAt = DateTimeFormatter.ISO_INSTANT.format(startedAtTime);
            }
            Instant completedAtTime = job.getCompletedAt();
            if (completedAtTime == null) {
                completedAt = null;
            } else {
                completedAt = DateTimeFormatter.ISO_INSTANT.format(completedAtTime);
            }
        }
    }
}
