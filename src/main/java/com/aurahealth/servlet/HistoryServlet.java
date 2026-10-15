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
 * Controller Servlet for Patient Medical History & Clinical EHR Records.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/history:</b> Role-filtered access:
 *     <ul>
 *       <li>Patient: Views their own personal medical timeline.</li>
 *       <li>Doctor: Views records of patients who have booked consultations with them.</li>
 *       <li>Admin: Views records for a specified {@code ?patientId=} query parameter.</li>
 *     </ul>
 *   </li>
 *   <li><b>POST /api/history:</b> Adds a clinical entry:
 *     <ul>
 *       <li>Patient adds self-reported symptoms/notes (doctorId is null).</li>
 *       <li>Doctor appends verified clinical prescriptions/diagnoses for their active patients.</li>
 *     </ul>
 *   </li>
 * </ul>
 * </p>
 */
@WebServlet("/api/history")
public class HistoryServlet extends ApiServlet {

    private final HistoryDAO history;
    private final AppointmentDAO appts;

    /**
     * Constructs HistoryServlet with required DAO dependencies.
     */
    public HistoryServlet() {
        this.history = new HistoryDAO();
        this.appts = new AppointmentDAO();
    }

    /**
     * Handles GET requests: retrieves medical history records filtered by user role.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        switch (u.role()) {
            case "patient" -> send(resp, 200, history.byPatient(u.id()));
            case "doctor" -> send(resp, 200, history.forDoctor(u.id()));
            default -> {
                try {
                    String param = req.getParameter("patientId");
                    if (param == null || param.isBlank()) {
                        throw new ApiException(400, "Query parameter 'patientId' is required for administrator queries.");
                    }
                    send(resp, 200, history.byPatient(Integer.parseInt(param)));
                } catch (NumberFormatException e) {
                    throw new ApiException(400, "Query parameter 'patientId' must be a valid integer.");
                }
            }
        }
    }

    /**
     * Handles POST requests: records a new clinical note or patient health entry.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        JsonObject b = body(req);

        String details = str(b, "details");
        if (details.isEmpty()) {
            throw new ApiException(400, "Clinical notes or medical details cannot be empty.");
        }

        if ("patient".equals(u.role())) {
            // Patient self-reported note
            history.add(u.id(), null, details);
        } else {
            // Doctor diagnosis - enforce doctor-patient clinical relationship
            int pid = num(b, "patientId");
            if (!appts.hasRelation(u.id(), pid)) {
                throw new ApiException(403, "Access restricted: You may only record clinical entries for your own patients.");
            }
            history.add(pid, u.id(), details);
        }

        send(resp, 201, Map.of("message", "Medical record saved successfully."));
    }
}

