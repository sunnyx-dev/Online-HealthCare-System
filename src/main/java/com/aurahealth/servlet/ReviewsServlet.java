package com.aurahealth.servlet;

import com.aurahealth.dao.AppointmentDAO;
import com.aurahealth.dao.ReviewDAO;
import com.aurahealth.model.Appointment;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/**
 * GET  /api/reviews              doctor: own reviews | others: ?doctorId=
 * POST /api/reviews              patient {appointmentId,stars,comment} (Completed visits only, once each)
 */
@WebServlet("/api/reviews")
public class ReviewsServlet extends ApiServlet {
    private final ReviewDAO reviews = new ReviewDAO();
    private final AppointmentDAO appts = new AppointmentDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        int did;
        if (u.role().equals("doctor")) did = u.id();
        else try { did = Integer.parseInt(req.getParameter("doctorId")); }
        catch (NumberFormatException e) { throw new ApiException(400, "doctorId is required."); }
        send(resp, 200, reviews.byDoctor(did));
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient");
        JsonObject b = body(req);
        Appointment a = appts.findById(num(b, "appointmentId")).orElseThrow(() -> new ApiException(404, "Appointment not found."));
        int stars = num(b, "stars");
        if (a.patientId != u.id()) throw new ApiException(403, "This is not your appointment.");
        if (!a.status.equals("Completed")) throw new ApiException(400, "You can review a visit after it is completed.");
        if (stars < 1 || stars > 5) throw new ApiException(400, "Stars must be 1 to 5.");
        if (reviews.exists(a.id)) throw new ApiException(409, "You already reviewed this visit.");
        reviews.add(a.id, a.doctorId, u.id(), stars, str(b, "comment"));
        send(resp, 201, Map.of("message", "Thanks for your review."));
    }
}
