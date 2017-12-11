/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import dk.dbc.commons.testutils.postgres.connection.PostgresITDataSource;
import java.io.File;
import java.util.Arrays;
import java.util.Iterator;
import org.glassfish.embeddable.BootstrapProperties;
import org.glassfish.embeddable.CommandResult;
import org.glassfish.embeddable.CommandRunner;
import org.glassfish.embeddable.Deployer;
import org.glassfish.embeddable.GlassFish;
import org.glassfish.embeddable.GlassFishProperties;
import org.glassfish.embeddable.GlassFishRuntime;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class Payara {

    int payaraPort;
    GlassFish glassfish;
    CommandRunner runner;
    PostgresITDataSource pg;
    String solrDocStoreUrl;

    public Payara(String port, Object... objs) throws Exception {
        payaraPort = Integer.parseInt(port);
        BootstrapProperties bootstrap = new BootstrapProperties();
        GlassFishRuntime runtime = GlassFishRuntime.bootstrap(bootstrap);
        GlassFishProperties glassfishProperties = new GlassFishProperties();
        glassfishProperties.setPort("http-listener", payaraPort);
        glassfish = runtime.newGlassFish(glassfishProperties);
        glassfish.start();
        runner = glassfish.getCommandRunner();
        runner.setTerse(true);

        Iterator<Object> i = Arrays.asList(objs).iterator();
    }

    public Payara deploy(String warFile, String contextRoot) throws Exception {
        Deployer deployer = glassfish.getDeployer();

        File war = new File(warFile);

        if (!war.exists()) {
            throw new IllegalStateException("War doesn't exist: " + war.toString());
        }

        deployer.deploy(war, "--contextroot=" + contextRoot, "--force=true");
        return this;
    }

    public Payara cmd(String format, Object... args) throws Exception {
        run(format, args);
        return this;
    }

    public Payara withJar(File file) throws Exception {
        run("add-library --type common %s", file.getAbsolutePath());
        return this;
    }

    public Payara withDataSource(String jdbc, String url) {
        String user = System.getProperty("user.name");
        String pass = "";
        String hostportbase;
        String[] atParts = url.split("@", 2);
        if (atParts.length == 1) {
            hostportbase = atParts[0];
        } else {
            String[] userpass = atParts[0].split(":", 2);
            user = userpass[0];
            if (userpass.length == 2) {
                pass = userpass[1];
            }
            hostportbase = atParts[1];
        }
        run("create-jdbc-connection-pool --restype=javax.sql.DataSource --datasourceclassname=org.postgresql.ds.PGSimpleDataSource --property=driverClass=org.postgresql.Driver:url=\"jdbc:postgresql://%s\":User=\"%s\":Password=\"%s\" %s/pool",
            hostportbase, user, pass, jdbc);
        run("create-jdbc-resource --connectionpoolid=%s/pool %s",
            jdbc, jdbc);
        return this;
    }

    public void stop() throws Exception {
        glassfish.stop();
    }

    private CommandResult run(String format, Object... args) {
        String cmd = String.format(format, args);
        System.out.println("cmd = " + cmd);
        String[] parts = cmd.split(" ");
        String first = parts[0];
        parts = Arrays.copyOfRange(parts, 1, parts.length);
        return runner.run(first, parts);
    }

}
