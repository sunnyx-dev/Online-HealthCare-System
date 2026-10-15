package com.aurahealth.servlet;

import com.aurahealth.dao.AppointmentDAO;
import com.aurahealth.dao.SettingsDAO;
import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.Appointment;
import com.aurahealth.model.Doctor;
import com.aurahealth.service.SlotService;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Set;

/**
 * Controller Servlet for Appointment Booking, Scheduling, and Status Management.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/appointments:</b> Returns role-scoped appointments (Patient views own, Doctor views assigned, Admin views all).</li>
 *   <li><b>POST /api/appointments:</b> Patient books a consultation slot (checks slot availability & booking feature toggle).</li>
 *   <li><b>PUT /api/appointments/{id}:</b> Updates appointment status (Doctors confirm/complete, Patients cancel) or reschedules (Admin only).</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/appointments/*")
public class AppointmentsServlet extends ApiServlet {

    private static final Set<String> STATUSES = Set.of("Pending", "Confirmed", "Completed", "Cancelled");

    private final AppointmentDAO appts;
    private final UserDAO users;
    private final SettingsDAO settings;
    private final SlotService slots;

    /**
     * Initializes default DAO and Service dependencies.
     */
    public AppointmentsServlet() {
        this.appts = new AppointmentDAO();
        this.users = new UserDAO();
        this.settings = new SettingsDAO();
        this.slots = new SlotService();
    }

    /**
     * Handles GET requests: retrieves appointments filtered by authenticated user's role.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        send(resp, 200, switch (u.role()) {
            case "admin" -> appts.findAll();
            case "doctor" -> appts.byDoctor(u.id());
            default -> appts.byPatient(u.id());
        });
    }

    /**
     * Handles POST requests: books a new consultation slot for an authenticated patient.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient");
        if (!settings.bookingEnabled()) {
            throw new ApiException(403, "Online appointment booking is currently paused by the administrator.");
        }

        JsonObject b = body(req);
        Doctor d = users.findDoctor(num(b, "doctorId"))
            .orElseThrow(() -> new ApiException(404, "Doctor not found."));

        String date = str(b, "date");
        String time = str(b, "time");

        try {
            if (!slots.freeSlots(d, date).contains(time)) {
                throw new ApiException(409, "The selected slot is no longer available. Please select another time.");
            }
        } catch (DateTimeParseException e) {
            throw new ApiException(400, "Invalid format. Expected date format 'yyyy-MM-dd' and time format 'HH:mm'.");
        }

        Appointment a = appts.book(u.id(), d.getId(), date, time)
            .orElseThrow(() -> new ApiException(409, "This slot was just reserved by another patient. Please pick an alternate time."));

        send(resp, 201, a);
    }

    /**
     * Handles PUT requests: modifies appointment status or reschedules slot times.
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        Appointment a = appts.findById(idFrom(req))
            .orElseThrow(() -> new ApiException(404, "Appointment not found."));

        JsonObject b = body(req);
        String status = str(b, "status");
        String date = str(b, "date");
        String time = str(b, "time");

        // Ownership verification
        boolean owns = ("patient".equals(u.role()) && a.patientId == u.id()) ||
                       ("doctor".equals(u.role()) && a.doctorId == u.id());

        if (!"admin".equals(u.role()) && !owns) {
            throw new ApiException(403, "Access denied. You do not own this appointment record.");
        }

        // Reschedule handling (Admin restricted)
        if (!date.isEmpty() || !time.isEmpty()) {
            if (!"admin".equals(u.role())) {
                throw new ApiException(403, "Only clinic administrators are authorized to reschedule appointments.");
            }
            try {
                if (!appts.reschedule(a, date, time)) {
                    throw new ApiException(409, "Conflict: Doctor already has an active appointment at that time.");
                }
            } catch (IllegalArgumentException | DateTimeParseException e) {
                throw new ApiException(400, "Invalid format. Expected date 'yyyy-MM-dd' and time 'HH:mm'.");
            }
        }

        // Status transition handling
        if (!status.isEmpty()) {
            if (!STATUSES.contains(status)) {
                throw new ApiException(400, "Unrecognized appointment status: " + status);
            }
            if ("patient".equals(u.role()) && !"Cancelled".equalsIgnoreCase(status)) {
                throw new ApiException(403, "Patients are only permitted to cancel their appointments.");
            }
            appts.setStatus(a.id, status);
        }

        send(resp, 200, Map.of(
            "message", "Appointment successfully updated.",
            "appointment", appts.findById(a.id).orElseThrow()
        ));
    }
}

