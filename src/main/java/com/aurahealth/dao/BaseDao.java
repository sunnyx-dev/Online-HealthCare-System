package com.aurahealth.dao;

import com.aurahealth.util.DataException;
import com.aurahealth.util.Db;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Abstract Base Data Access Object (BaseDao).
 * <p>
 * Provides robust, reusable JDBC query execution templates for all DAO implementations:
 * <ul>
 *   <li><b>SQL Injection Prevention:</b> All parameters are bound via {@link PreparedStatement} parameter placeholders.</li>
 *   <li><b>Resource Safety:</b> Automatically manages {@link Connection}, {@link PreparedStatement}, and {@link ResultSet}
 *       lifecycles using Java's {@code try-with-resources} idiom to guarantee zero connection or cursor leaks.</li>
 *   <li><b>Exception Translation:</b> Encapsulates checked {@link SQLException} into runtime {@link DataException}
 *       to keep service and controller layers clean and decoupled from low-level JDBC mechanics.</li>
 * </ul>
 * </p>
 */
public abstract class BaseDao {

    /**
     * Functional interface representing an operation that maps a single {@link ResultSet} row
     * to a strongly-typed domain model object.
     *
     * @param <T> the target entity type
     */
    @FunctionalInterface
    protected interface RowMapper<T> {
        /**
         * Maps the current row of the given {@link ResultSet} to an entity instance.
         *
         * @param rs the active ResultSet pointing to the current record
         * @return the mapped domain object
         * @throws SQLException if a database access error occurs
         */
        T map(ResultSet rs) throws SQLException;
    }

    /**
     * Binds variable-length arguments to standard 1-indexed PreparedStatement positional parameters.
     *
     * @param ps the prepared statement to bind parameters to
     * @param args the array of positional arguments to bind
     * @throws SQLException if a database error occurs during binding
     */
    private static void bind(PreparedStatement ps, Object[] args) throws SQLException {
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }
    }

    /**
     * Executes a parameterized SQL SELECT query and transforms each matching row
     * using the supplied {@link RowMapper}.
     *
     * @param <T> the type of domain objects to return
     * @param sql the SQL SELECT statement with '?' placeholders
     * @param mapper the functional RowMapper lambda or method reference
     * @param args positional query arguments
     * @return a list of domain objects mapped from the result set
     * @throws DataException if a database error occurs
     */
    protected <T> List<T> query(String sql, RowMapper<T> mapper, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, args);
            try (ResultSet rs = ps.executeQuery()) {
                List<T> out = new ArrayList<>();
                while (rs.next()) {
                    out.add(mapper.map(rs));
                }
                return out;
            }
        } catch (SQLException e) {
            throw new DataException("Failed to execute query: " + sql, e);
        }
    }

    /**
     * Executes a parameterized SQL UPDATE or DELETE command.
     *
     * @param sql the SQL statement with '?' parameter placeholders
     * @param args positional arguments
     * @return the number of database rows affected by this execution
     * @throws DataException if a database error occurs
     */
    protected int update(String sql, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, args);
            return ps.executeUpdate();
        } catch (SQLException e) {
            throw new DataException("Failed to execute update: " + sql, e);
        }
    }

    /**
     * Executes a parameterized SQL INSERT command and retrieves the automatically generated primary key ID.
     *
     * @param sql the SQL INSERT statement with '?' parameter placeholders
     * @param args positional arguments
     * @return the newly generated auto-increment integer ID, or 0 if not generated
     * @throws DataException if a database error occurs
     */
    protected int insert(String sql, Object... args) {
        try (Connection c = Db.get(); PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bind(ps, args);
            ps.executeUpdate();
            try (ResultSet k = ps.getGeneratedKeys()) {
                return k.next() ? k.getInt(1) : 0;
            }
        } catch (SQLException e) {
            throw new DataException("Failed to execute insert: " + sql, e);
        }
    }

    /**
     * Executes a parameterized SQL query that returns a single numerical aggregate value (e.g. {@code COUNT(*)}).
     *
     * @param sql the SQL SELECT COUNT query statement
     * @param args positional arguments
     * @return the aggregate count value as a long
     * @throws DataException if a database error occurs
     */
    protected long count(String sql, Object... args) {
        return query(sql, rs -> rs.getLong(1), args).get(0);
    }
}

