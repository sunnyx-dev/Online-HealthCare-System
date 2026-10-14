package com.aurahealth.servlet;

import com.aurahealth.dao.ReviewDAO;
import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.Doctor;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

/**
 * GET  /api/doctors            public list with ratings
 * POST /api/doctors            admin creates a doctor {name,specialization,email,password}
 * PUT  /api/doctors/me         doctor updates own schedule {days:[1,2],start:"09:00",end:"16:00"}
 */
@WebServlet("/api/doctors/*")
public class DoctorsServlet extends ApiServlet {
    private final UserDAO users = new UserDAO();
    private final ReviewDAO reviews = new ReviewDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map<Integer, Double> avg = reviews.averages();
        List<Doctor> list = users.findDoctors();
        list.forEach(d -> d.setRating(avg.get(d.getId())));
        send(resp, 200, list);
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);
        String name = str(b, "name"), spec = str(b, "specialization"), email = str(b, "email"), pw = str(b, "password");
        if (name.isEmpty() || spec.isEmpty() || !email.contains("@") || pw.length() < 6)
            throw new ApiException(400, "Fill all fields. Password needs 6+ characters.");
        if (users.emailTaken(email, 0)) throw new ApiException(409, "That email already exists.");
        var d = users.create(name, email, pw, "doctor", spec);
        send(resp, 201, Map.of("message", "Doctor created. Send these credentials to the doctor.",
            "email", email.toLowerCase(), "password", pw, "doctor", d));
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser me = require(req, "doctor");
        JsonObject b = body(req);
        JsonArray arr = b.has("days") && b.get("days").isJsonArray() ? b.getAsJsonArray("days") : new JsonArray();
        List<Integer> days = new ArrayList<>();
        arr.forEach(e -> { int d = e.getAsInt(); if (d >= 0 && d <= 6 && !days.contains(d)) days.add(d); });
        String start = str(b, "start"), end = str(b, "end");
        if (!start.matches("\\d\\d:\\d\\d") || !end.matches("\\d\\d:\\d\\d") || start.compareTo(end) >= 0)
            throw new ApiException(400, "Start and end must be HH:mm and start must be before end.");
        users.updateSchedule(me.id(), days, start, end);
        send(resp, 200, Map.of("message", "Schedule updated."));
    }
}
