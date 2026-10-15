package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/**
 * Controller Servlet for User Self-Service Profile Management.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/profile:</b> Returns profile data for the authenticated patient or doctor.</li>
 *   <li><b>PUT /api/profile:</b> Updates display name, contact phone, email address, and password.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/profile")
public class ProfileServlet extends ApiServlet {

    private final UserDAO users;

    /**
     * Constructs ProfileServlet with UserDAO dependency.
     */
    public ProfileServlet() {
        this.users = new UserDAO();
    }

    /**
     * Handles GET requests: returns personal profile details of the logged-in user.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        send(resp, 200, users.findById(u.id()).orElseThrow(() -> new ApiException(404, "User profile not found.")));
    }

    /**
     * Handles PUT requests: updates personal account details and optional password hash.
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SessionUser u = require(req, "patient", "doctor");
        JsonObject b = body(req);

        String name = str(b, "name");
        String email = str(b, "email").toLowerCase();
        String pw = str(b, "password");
        String phone = str(b, "phone");

        if (name.isEmpty() || !email.contains("@")) {
            throw new ApiException(400, "Valid full name and email address format are required.");
        }
        if (!pw.isEmpty() && pw.length() < 6) {
            throw new ApiException(400, "New password must be at least 6 characters long.");
        }
        if (users.emailTaken(email, u.id())) {
            throw new ApiException(409, "The specified email is already in use by another account.");
        }

        users.updateProfile(u.id(), name, email, phone, pw);
        send(resp, 200, Map.of("message", "Profile updated successfully."));
    }
}

