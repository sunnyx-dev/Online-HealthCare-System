package com.aurahealth.servlet;

import com.aurahealth.dao.AdminDAO;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/** Creates the default admin (Sunny123 / Sunny_babu) the first time the app starts. */
@WebListener
public class AppStartup implements ServletContextListener {
    @Override public void contextInitialized(ServletContextEvent e) {
        try { new AdminDAO().ensureDefault("Sunny123", "Sunny_babu"); }
        catch (RuntimeException ex) { e.getServletContext().log("Could not seed admin. Is MySQL running and schema.sql loaded?", ex); }
    }
}
