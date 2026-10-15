package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.Doctor;
import com.aurahealth.service.SlotService;
import com.aurahealth.util.ApiException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.time.format.DateTimeParseException;
import java.util.Map;

/**
 * Controller Servlet for Real-Time Doctor Slot Availability & Schedule Previews.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/slots?doctorId={id}&amp;date={YYYY-MM-DD}:</b> Returns unbooked time slots for a specific date.</li>
 *   <li><b>GET /api/slots?doctorId={id}:</b> Returns upcoming preview of open dates and times across the next 5 working days.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/slots")
public class SlotsServlet extends ApiServlet {

    private final UserDAO users;
    private final SlotService slots;

    /**
     * Constructs SlotsServlet with required DAO and Service dependencies.
     */
    public SlotsServlet() {
        this.users = new UserDAO();
        this.slots = new SlotService();
    }

    /**
     * Handles GET requests: queries real-time open consultation slots.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req);

        int doctorId;
        try {
            String param = req.getParameter("doctorId");
            if (param == null || param.isBlank()) {
                throw new ApiException(400, "Query parameter 'doctorId' is required.");
            }
            doctorId = Integer.parseInt(param);
        } catch (NumberFormatException e) {
            throw new ApiException(400, "Query parameter 'doctorId' must be a valid integer.");
        }

        Doctor d = users.findDoctor(doctorId)
            .orElseThrow(() -> new ApiException(404, "Doctor not found."));

        String date = req.getParameter("date");
        if (date == null || date.isBlank()) {
            send(resp, 200, slots.nextFree(d, 5));
            return;
        }

        try {
            send(resp, 200, Map.of("date", date, "slots", slots.freeSlots(d, date)));
        } catch (DateTimeParseException e) {
            throw new ApiException(400, "Invalid date format. Expected 'yyyy-MM-dd'.");
        }
    }
}

