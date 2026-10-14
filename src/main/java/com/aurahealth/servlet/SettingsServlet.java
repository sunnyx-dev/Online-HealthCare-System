package com.aurahealth.servlet;

import com.aurahealth.dao.SettingsDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;
import java.util.Set;

/** GET /api/settings (public) | PUT /api/settings (admin) {clinic_name, slot_minutes, booking_enabled} */
@WebServlet("/api/settings")
public class SettingsServlet extends ApiServlet {
    private final SettingsDAO settings = new SettingsDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        send(resp, 200, settings.all());
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);
        String name = str(b, "clinic_name"), slot = str(b, "slot_minutes"), booking = str(b, "booking_enabled");
        if (name.isEmpty() || !Set.of("15", "20", "30", "45", "60").contains(slot) ||
            !(booking.equals("true") || booking.equals("false")))
            throw new ApiException(400, "Clinic name, slot length (15/20/30/45/60) and booking true/false are required.");
        settings.put("clinic_name", name);
        settings.put("slot_minutes", slot);
        settings.put("booking_enabled", booking);
        send(resp, 200, Map.of("message", "Settings updated successfully."));
    }
}
