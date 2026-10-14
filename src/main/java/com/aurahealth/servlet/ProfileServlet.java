package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/** GET/PUT /api/profile : the logged-in patient or doctor manages their own details. */
@WebServlet("/api/profile")
public class ProfileServlet extends ApiServlet {
    private final UserDAO users = new UserDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        send(resp, 200, users.findById(u.id()).orElseThrow(() -> new ApiException(404, "User not found.")));
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        JsonObject b = body(req);
        String name = str(b, "name"), email = str(b, "email"), pw = str(b, "password");
        if (name.isEmpty() || !email.contains("@")) throw new ApiException(400, "Name and a valid email are required.");
        if (!pw.isEmpty() && pw.length() < 6) throw new ApiException(400, "New password needs 6+ characters.");
        if (users.emailTaken(email, u.id())) throw new ApiException(409, "That email is already used.");
        users.updateProfile(u.id(), name, email, str(b, "phone"), pw);
        send(resp, 200, Map.of("message", "Profile updated successfully."));
    }
}
