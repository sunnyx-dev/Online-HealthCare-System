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
 * Controller Servlet for Verified Patient Doctor Reviews & Ratings.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/reviews:</b> Retrieves feedback reviews:
 *     <ul>
 *       <li>Doctor: Views reviews submitted for their own consultations.</li>
 *       <li>Other roles: Queries reviews for a specific doctor via {@code ?doctorId=} parameter.</li>
 *     </ul>
 *   </li>
 *   <li><b>POST /api/reviews:</b> Patient submits a 1-to-5 star review and comment for a consultation.
 *       Enforces that the consultation status must be 'Completed' and prevents duplicate reviews.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/reviews")
public class ReviewsServlet extends ApiServlet {

    private final ReviewDAO reviews;
    private final AppointmentDAO appts;

    /**
     * Constructs ReviewsServlet with required DAO dependencies.
     */
    public ReviewsServlet() {
        this.reviews = new ReviewDAO();
        this.appts = new AppointmentDAO();
    }

    /**
     * Handles GET requests: retrieves reviews for an attending doctor.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req);
        int doctorId;

        if ("doctor".equalsIgnoreCase(u.role())) {
            doctorId = u.id();
        } else {
            try {
                String param = req.getParameter("doctorId");
                if (param == null || param.isBlank()) {
                    throw new ApiException(400, "Query parameter 'doctorId' is required.");
                }
                doctorId = Integer.parseInt(param);
            } catch (NumberFormatException e) {
                throw new ApiException(400, "Query parameter 'doctorId' must be a valid integer.");
            }
        }

        send(resp, 200, reviews.byDoctor(doctorId));
    }

    /**
     * Handles POST requests: submits a verified review from an authenticated patient.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient");
        JsonObject b = body(req);

        Appointment a = appts.findById(num(b, "appointmentId"))
            .orElseThrow(() -> new ApiException(404, "Appointment not found."));

        int stars = num(b, "stars");

        if (a.patientId != u.id()) {
            throw new ApiException(403, "Access denied: You may only review your own appointments.");
        }
        if (!"Completed".equalsIgnoreCase(a.status)) {
            throw new ApiException(400, "Reviews may only be submitted for completed consultations.");
        }
        if (stars < 1 || stars > 5) {
            throw new ApiException(400, "Star rating score must be an integer between 1 and 5.");
        }
        if (reviews.exists(a.id)) {
            throw new ApiException(409, "A review has already been submitted for this consultation.");
        }

        reviews.add(a.id, a.doctorId, u.id(), stars, str(b, "comment"));
        send(resp, 201, Map.of("message", "Thank you! Your feedback has been recorded."));
    }
}

