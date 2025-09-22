package dk.dbc.search.solrdocstore.monitor;

import java.sql.ResultSet;
import java.sql.SQLException;
import dk.db.pg.queue.monitor.mapper.PgQueueMonitorMapper;

public class Mapper implements PgQueueMonitorMapper {

    private static final String[] COLUMNS = "jobid".split(",");

    @Override
    public String[] columns() {
        return COLUMNS;
    }

    @Override
    public String description(ResultSet resultSet) throws SQLException {
        return resultSet.getString(1);
    }
}
