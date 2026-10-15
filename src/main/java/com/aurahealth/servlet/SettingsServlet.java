package com.aurahealth.servlet;

import com.aurahealth.dao.SettingsDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;
import java.util.Set;

/**
 * Controller Servlet for Global Clinic Settings & Operational Toggles.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/settings:</b> Public read-only access to clinic name, slot duration, and booking availability.</li>
 *   <li><b>PUT /api/settings:</b> Administrator endpoint to modify branding, slot partition duration, and booking state.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/settings")
public class SettingsServlet extends ApiServlet {

    private static final Set<String> VALID_SLOT_MINUTES = Set.of("15", "20", "30", "45", "60");
    private final SettingsDAO settings;

    /**
     * Constructs SettingsServlet with SettingsDAO dependency.
     */
    public SettingsServlet() {
        this.settings = new SettingsDAO();
    }

    /**
     * Handles GET requests: returns all global system settings.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        send(resp, 200, settings.all());
    }

    /**
     * Handles PUT requests: updates clinic configuration parameters (Admin restricted).
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);

        String name = str(b, "clinic_name");
        String slot = str(b, "slot_minutes");
        String booking = str(b, "booking_enabled");

        if (name.isEmpty() || !VALID_SLOT_MINUTES.contains(slot) || !("true".equalsIgnoreCase(booking) || "false".equalsIgnoreCase(booking))) {
            throw new ApiException(400, "Valid clinic name, slot length (15, 20, 30, 45, 60 minutes), and booking toggle (true/false) are required.");
        }

        settings.put("clinic_name", name);
        settings.put("slot_minutes", slot);
        settings.put("booking_enabled", booking.toLowerCase());

        send(resp, 200, Map.of("message", "Clinic settings updated successfully."));
    }
}

