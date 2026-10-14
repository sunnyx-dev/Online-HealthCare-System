package com.aurahealth.servlet;

import com.aurahealth.dao.AdminDAO;
import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.User;
import com.aurahealth.util.ApiException;
import com.aurahealth.util.FirebaseVerifier;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * POST /api/auth/login     {email,password}   patients AND doctors
 * POST /api/auth/register  {name,email,password}   patients only
 * POST /api/auth/admin     {id,password}
 * POST /api/auth/google    {idToken}   Firebase Google sign-in
 * POST /api/auth/logout    GET /api/auth/me
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends ApiServlet {
    private final UserDAO users = new UserDAO();
    private final AdminDAO admins = new AdminDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!"me".equals(sub(req))) throw new ApiException(404, "Not found.");
        SessionUser u = require(req);
        send(resp, 200, u);
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String action = sub(req);
        if ("logout".equals(action)) {
            HttpSession s = req.getSession(false);
            if (s != null) s.invalidate();
            send(resp, 200, Map.of("message", "Logged out."));
            return;
        }
        JsonObject b = body(req);
        switch (action) {
            case "login" -> {
                User u = users.authenticate(str(b, "email"), str(b, "password"));
                if (u == null) throw new ApiException(401, "Wrong email or password.");
                startSession(req, resp, u, 200);
            }
            case "register" -> {
                String name = str(b, "name"), email = str(b, "email").toLowerCase(), pw = str(b, "password");
                if (name.isEmpty() || !email.contains("@") || pw.length() < 6)
                    throw new ApiException(400, "Enter your name, a valid email and a password of 6+ characters.");
                if (users.emailTaken(email, 0)) throw new ApiException(409, "This email is already registered. Log in instead.");
                startSession(req, resp, users.create(name, email, pw, "patient", null), 201);
            }
            case "admin" -> {
                if (!admins.verify(str(b, "id"), str(b, "password"))) throw new ApiException(401, "Wrong admin ID or password.");
                SessionUser a = new SessionUser(0, str(b, "id"), "admin");
                login(req, a);
                send(resp, 200, a);
            }
            case "google" -> {
                FirebaseToken t = FirebaseVerifier.verify(str(b, "idToken"));
                String email = t.getEmail().toLowerCase();
                User u = users.findByEmail(email).orElseGet(() ->
                    users.create(t.getName() == null ? email.split("@")[0] : t.getName(), email,
                        UUID.randomUUID().toString(), "patient", null));
                startSession(req, resp, u, 200);
            }
            default -> throw new ApiException(404, "Not found.");
        }
    }

    private void startSession(HttpServletRequest req, HttpServletResponse resp, User u, int code) throws IOException {
        login(req, new SessionUser(u.getId(), u.getName(), u.getRole()));
        send(resp, code, u);
    }
}
