package com.aurahealth.servlet;

import com.aurahealth.dao.ReviewDAO;
import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.Doctor;
import com.aurahealth.model.User;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

/**
 * Controller Servlet for Doctor Listings, Administrative Onboarding, and Schedule Customization.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/doctors:</b> Public directory of active medical practitioners with aggregated ratings.</li>
 *   <li><b>POST /api/doctors:</b> Administrator endpoint to onboard a new doctor with clinical specialty credentials.</li>
 *   <li><b>PUT /api/doctors/me:</b> Doctor self-service endpoint to configure working days and OPD hours.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/doctors/*")
public class DoctorsServlet extends ApiServlet {

    private final UserDAO users;
    private final ReviewDAO reviews;

    /**
     * Constructs DoctorsServlet with required DAO dependencies.
     */
    public DoctorsServlet() {
        this.users = new UserDAO();
        this.reviews = new ReviewDAO();
    }

    /**
     * Handles GET requests: returns all doctors with their aggregate review star ratings.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<Integer, Double> avg = reviews.averages();
        List<Doctor> list = users.findDoctors();
        list.forEach(d -> d.setRating(avg.get(d.getId())));
        send(resp, 200, list);
    }

    /**
     * Handles POST requests: allows Administrator to onboard a doctor account.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);

        String name = str(b, "name");
        String spec = str(b, "specialization");
        String email = str(b, "email").toLowerCase();
        String pw = str(b, "password");

        if (name.isEmpty() || spec.isEmpty() || !email.contains("@") || pw.length() < 6) {
            throw new ApiException(400, "Please provide valid doctor name, specialty, email, and password (min 6 characters).");
        }
        if (users.emailTaken(email, 0)) {
            throw new ApiException(409, "A user or doctor with this email address already exists.");
        }

        User d = users.create(name, email, pw, "doctor", spec);
        send(resp, 201, Map.of(
            "message", "Doctor onboarded successfully. Share these credentials with the practitioner.",
            "email", email,
            "password", pw,
            "doctor", d
        ));
    }

    /**
     * Handles PUT requests: allows an authenticated doctor to update their own working schedule.
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser me = require(req, "doctor");
        JsonObject b = body(req);

        JsonArray arr = b.has("days") && b.get("days").isJsonArray() ? b.getAsJsonArray("days") : new JsonArray();
        List<Integer> days = new ArrayList<>();
        arr.forEach(e -> {
            int d = e.getAsInt();
            if (d >= 0 && d <= 6 && !days.contains(d)) {
                days.add(d);
            }
        });

        String start = str(b, "start");
        String end = str(b, "end");

        if (!start.matches("\\d\\d:\\d\\d") || !end.matches("\\d\\d:\\d\\d") || start.compareTo(end) >= 0) {
            throw new ApiException(400, "Start and end times must follow 'HH:mm' format with start time preceding end time.");
        }

        users.updateSchedule(me.id(), days, start, end);
        send(resp, 200, Map.of("message", "OPD schedule updated successfully."));
    }
}

