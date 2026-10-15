package com.aurahealth.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * JDBC Database Connection Factory.
 * <p>
 * Centralizes MySQL connection provisioning for the AuraHealth backend.
 * Supports configurable connection properties through environment variables:
 * <ul>
 *   <li>{@code DB_URL}: JDBC connection URL (default: {@code jdbc:mysql://localhost:3306/aurahealth})</li>
 *   <li>{@code DB_USER}: Database username (default: {@code root})</li>
 *   <li>{@code DB_PASS}: Database password (default: empty)</li>
 * </ul>
 * Enforces UTF-8 character encoding, SSL preferences, and timezone synchronization.
 * </p>
 */
public final class Db {

    /** Default fallback JDBC database connection URL. */
    private static final String DEFAULT_URL =
        "jdbc:mysql://localhost:3306/aurahealth?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";

    private static final String URL = env("DB_URL", DEFAULT_URL);
    private static final String USER = env("DB_USER", "root");
    private static final String PASS = env("DB_PASS", "");

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError("MySQL JDBC Driver (com.mysql.cj.jdbc.Driver) not found in classpath: " + e.getMessage());
        }
    }

    /**
     * Private constructor to prevent direct instantiation of utility class.
     */
    private Db() {}

    /**
     * Reads an environment variable with a fallback default.
     *
     * @param k environment variable key name
     * @param d default value if unset or blank
     * @return resolved value
     */
    private static String env(String k, String d) {
        String v = System.getenv(k);
        return (v == null || v.isBlank()) ? d : v;
    }

    /**
     * Obtains an active connection to the MySQL database.
     * Callers must close the returned connection (typically via {@code try-with-resources}).
     *
     * @return a new active {@link Connection}
     * @throws SQLException if a database connection cannot be established
     */
    public static Connection get() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}

