package com.aurahealth.servlet;

import com.aurahealth.dao.StatsDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

/**
 * Controller Servlet for Administrative Business Analytics & Clinic Metrics.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/analytics:</b> Returns clinic KPIs including total patient registrations,
 *       active doctor headcount, appointment status distributions, and doctor workload breakdowns.
 *       Restricted to administrator role.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/analytics")
public class AnalyticsServlet extends ApiServlet {

    private final StatsDAO stats;

    /**
     * Constructs AnalyticsServlet with StatsDAO dependency.
     */
    public AnalyticsServlet() {
        this.stats = new StatsDAO();
    }

    /**
     * Handles GET requests: compiles and returns statistical summary for dashboard charts.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        send(resp, 200, stats.summary());
    }
}

