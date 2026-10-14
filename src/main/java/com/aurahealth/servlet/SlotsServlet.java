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

/** GET /api/slots?doctorId=3&date=2026-10-20 -> free slots; GET /api/slots?doctorId=3 -> next free days */
@WebServlet("/api/slots")
public class SlotsServlet extends ApiServlet {
    private final UserDAO users = new UserDAO();
    private final SlotService slots = new SlotService();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req);
        int id;
        try { id = Integer.parseInt(req.getParameter("doctorId")); }
        catch (NumberFormatException e) { throw new ApiException(400, "doctorId is required."); }
        Doctor d = users.findDoctor(id).orElseThrow(() -> new ApiException(404, "Doctor not found."));
        String date = req.getParameter("date");
        if (date == null) { send(resp, 200, slots.nextFree(d, 5)); return; }
        try { send(resp, 200, Map.of("date", date, "slots", slots.freeSlots(d, date))); }
        catch (DateTimeParseException e) { throw new ApiException(400, "date must be yyyy-MM-dd."); }
    }
}
