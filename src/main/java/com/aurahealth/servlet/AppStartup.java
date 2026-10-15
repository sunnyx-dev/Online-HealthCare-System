package com.aurahealth.servlet;

import com.aurahealth.dao.AdminDAO;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * Web Application Lifecycle Listener (Servlet Context Bootstrap).
 * <p>
 * Automatically executes upon servlet container startup (e.g. Apache Tomcat).
 * Ensures that the default system administrator account (Sunny123 / Sunny_babu)
 * is provisioned in the database with PBKDF2 salted hash encryption.
 * </p>
 */
@WebListener
public class AppStartup implements ServletContextListener {

    /**
     * Initializes application context and bootstraps initial seed data.
     *
     * @param e servlet context event
     */
    @Override
    public void contextInitialized(ServletContextEvent e) {
        try {
            new AdminDAO().ensureDefault("Sunny123", "Sunny_babu");
            e.getServletContext().log("AuraHealth initialized: Default administrator account verified.");
        } catch (RuntimeException ex) {
            e.getServletContext().log("Could not seed default admin. Ensure MySQL is running and schema.sql is imported.", ex);
        }
    }

    /**
     * Cleans up resources when the servlet context is destroyed.
     *
     * @param e servlet context event
     */
    @Override
    public void contextDestroyed(ServletContextEvent e) {
        // Resource cleanup handled by JDBC driver and pool lifecycle
    }
}

