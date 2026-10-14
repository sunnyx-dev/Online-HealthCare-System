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
 * GET  /api/appointments        own list (admin: all)
 * POST /api/appointments        patient books {doctorId,date,time}
 * PUT  /api/appointments/{id}   {status} and/or {date,time} (reschedule: admin only)
 */
@WebServlet("/api/appointments/*")
public class AppointmentsServlet extends ApiServlet {
    private static final Set<String> STATUSES = Set.of("Pending", "Confirmed", "Completed", "Cancelled");
    private final AppointmentDAO appts = new AppointmentDAO();
    private final UserDAO users = new UserDAO();
    private final SettingsDAO settings = new SettingsDAO();
    private final SlotService slots = new SlotService();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        send(resp, 200, switch (u.role()) {
            case "admin" -> appts.findAll();
            case "doctor" -> appts.byDoctor(u.id());
            default -> appts.byPatient(u.id());
        });
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient");
        if (!settings.bookingEnabled()) throw new ApiException(403, "Online booking is currently disabled by the admin.");
        JsonObject b = body(req);
        Doctor d = users.findDoctor(num(b, "doctorId")).orElseThrow(() -> new ApiException(404, "Doctor not found."));
        String date = str(b, "date"), time = str(b, "time");
        try {
            if (!slots.freeSlots(d, date).contains(time))
                throw new ApiException(409, "That slot is not available. Pick another time.");
        } catch (DateTimeParseException e) { throw new ApiException(400, "Use date yyyy-MM-dd and time HH:mm."); }
        Appointment a = appts.book(u.id(), d.getId(), date, time)
            .orElseThrow(() -> new ApiException(409, "Someone just booked that slot. Pick another time."));
        send(resp, 201, a);
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        Appointment a = appts.findById(idFrom(req)).orElseThrow(() -> new ApiException(404, "Appointment not found."));
        JsonObject b = body(req);
        String status = str(b, "status"), date = str(b, "date"), time = str(b, "time");

        boolean owns = (u.role().equals("patient") && a.patientId == u.id()) || (u.role().equals("doctor") && a.doctorId == u.id());
        if (!u.role().equals("admin") && !owns) throw new ApiException(403, "This is not your appointment.");

        if (!date.isEmpty() || !time.isEmpty()) {
            if (!u.role().equals("admin")) throw new ApiException(403, "Only the admin can reschedule.");
            try { if (!appts.reschedule(a, date, time)) throw new ApiException(409, "That doctor already has a booking then."); }
            catch (IllegalArgumentException | DateTimeParseException e) { throw new ApiException(400, "Use date yyyy-MM-dd and time HH:mm."); }
        }
        if (!status.isEmpty()) {
            if (!STATUSES.contains(status)) throw new ApiException(400, "Unknown status.");
            if (u.role().equals("patient") && !status.equals("Cancelled"))
                throw new ApiException(403, "Patients can only cancel.");
            appts.setStatus(a.id, status);
        }
        send(resp, 200, Map.of("message", "Appointment updated.", "appointment", appts.findById(a.id).orElseThrow()));
    }
}
