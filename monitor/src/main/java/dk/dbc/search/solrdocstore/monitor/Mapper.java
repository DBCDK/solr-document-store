/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of solrdocstore-monitor.
 *
 * solrdocstore-monitor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solrdocstore-monitor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.monitor;

import dk.dbc.pgqueue.ee.diags.JobLogMapper;
import java.util.Locale;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class Mapper {

    public static final JobLogMapper MAPPER = (r) ->
            String.format(Locale.ROOT, "%s", r.getString("jobid"));

}
