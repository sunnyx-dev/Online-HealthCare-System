package com.aurahealth.servlet;

import com.aurahealth.dao.StatsDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

/** GET /api/analytics (admin) -> counts and per-doctor / per-status totals for the charts. */
@WebServlet("/api/analytics")
public class AnalyticsServlet extends ApiServlet {
    private final StatsDAO stats = new StatsDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        send(resp, 200, stats.summary());
    }
}
