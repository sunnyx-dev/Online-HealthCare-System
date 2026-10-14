package com.aurahealth.servlet;

import com.aurahealth.dao.AppointmentDAO;
import com.aurahealth.dao.HistoryDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/**
 * GET  /api/history  patient: own records | doctor: records of their patients | admin: ?patientId=
 * POST /api/history  patient {details} | doctor {patientId,details}
 */
@WebServlet("/api/history")
public class HistoryServlet extends ApiServlet {
    private final HistoryDAO history = new HistoryDAO();
    private final AppointmentDAO appts = new AppointmentDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        switch (u.role()) {
            case "patient" -> send(resp, 200, history.byPatient(u.id()));
            case "doctor" -> send(resp, 200, history.forDoctor(u.id()));
            default -> {
                try { send(resp, 200, history.byPatient(Integer.parseInt(req.getParameter("patientId")))); }
                catch (NumberFormatException e) { throw new ApiException(400, "patientId is required."); }
            }
        }
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        JsonObject b = body(req);
        String details = str(b, "details");
        if (details.isEmpty()) throw new ApiException(400, "Write the record first.");
        if (u.role().equals("patient")) history.add(u.id(), null, details);
        else {
            int pid = num(b, "patientId");
            if (!appts.hasRelation(u.id(), pid)) throw new ApiException(403, "You can only update records of your own patients.");
            history.add(pid, u.id(), details);
        }
        send(resp, 201, Map.of("message", "Record saved."));
    }
}
