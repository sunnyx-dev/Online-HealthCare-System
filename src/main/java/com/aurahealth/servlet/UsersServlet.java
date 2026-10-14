package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/** Admin only. GET /api/users, POST /api/users, PUT /api/users/{id}, DELETE /api/users/{id} */
@WebServlet("/api/users/*")
public class UsersServlet extends ApiServlet {
    private final UserDAO users = new UserDAO();

    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        send(resp, 200, users.findAll());
    }

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);
        String name = str(b, "name"), email = str(b, "email"), role = str(b, "role");
        check(name, email, role);
        if (users.emailTaken(email, 0)) throw new ApiException(409, "That email already exists.");
        String temp = "Aura@" + (1000 + (int) (Math.random() * 9000));
        var u = users.create(name, email, temp, role, "doctor".equals(role) ? "General Physician" : null);
        send(resp, 201, Map.of("message", "User created successfully.", "temporaryPassword", temp, "user", u));
    }

    @Override protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        int id = idFrom(req);
        JsonObject b = body(req);
        String name = str(b, "name"), email = str(b, "email"), role = str(b, "role");
        check(name, email, role);
        if (users.emailTaken(email, id)) throw new ApiException(409, "That email already exists.");
        if (!users.adminUpdate(id, name, email, role)) throw new ApiException(404, "User not found.");
        send(resp, 200, Map.of("message", "User updated successfully."));
    }

    @Override protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        if (!users.delete(idFrom(req))) throw new ApiException(404, "User not found.");
        send(resp, 200, Map.of("message", "User deleted successfully."));
    }

    private void check(String name, String email, String role) {
        if (name.isEmpty() || !email.contains("@") || !(role.equals("patient") || role.equals("doctor")))
            throw new ApiException(400, "Name, a valid email and role (patient or doctor) are required.");
    }
}
