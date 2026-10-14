package com.aurahealth.dao;

import com.aurahealth.util.DataException;
import com.aurahealth.util.Db;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/** Small JDBC helper: prepared statements, try-with-resources, no string-concatenated user input. */
public abstract class BaseDao {
    protected interface RowMapper<T> { T map(ResultSet rs) throws SQLException; }

    private static void bind(PreparedStatement ps, Object[] args) throws SQLException {
        for (int i = 0; i < args.length; i++) ps.setObject(i + 1, args[i]);
    }

    protected <T> List<T> query(String sql, RowMapper<T> mapper, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, args);
            try (ResultSet rs = ps.executeQuery()) {
                List<T> out = new ArrayList<>();
                while (rs.next()) out.add(mapper.map(rs));
                return out;
            }
        } catch (SQLException e) { throw new DataException(e); }
    }

    protected int update(String sql, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, args);
            return ps.executeUpdate();
        } catch (SQLException e) { throw new DataException(e); }
    }

    /** Runs an INSERT and returns the generated id. */
    protected int insert(String sql, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bind(ps, args);
            ps.executeUpdate();
            try (ResultSet k = ps.getGeneratedKeys()) { return k.next() ? k.getInt(1) : 0; }
        } catch (SQLException e) { throw new DataException(e); }
    }

    protected long count(String sql, Object... args) {
        return query(sql, rs -> rs.getLong(1), args).get(0);
    }
}
