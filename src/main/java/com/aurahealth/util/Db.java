package com.aurahealth.util;

import java.sql.*;

/** JDBC connection factory. Configure with DB_URL, DB_USER, DB_PASS environment variables. */
public final class Db {
    private static final String URL = env("DB_URL",
        "jdbc:mysql://localhost:3306/aurahealth?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private static final String USER = env("DB_USER", "root");
    private static final String PASS = env("DB_PASS", "");

    static {
        try { Class.forName("com.mysql.cj.jdbc.Driver"); }
        catch (ClassNotFoundException e) { throw new ExceptionInInitializerError(e); }
    }
    private Db() {}
    private static String env(String k, String d) { String v = System.getenv(k); return v == null || v.isBlank() ? d : v; }
    public static Connection get() throws SQLException { return DriverManager.getConnection(URL, USER, PASS); }
}
