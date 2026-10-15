package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.User;
import com.aurahealth.util.ApiException;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

/**
 * Controller Servlet for Administrative User Management (RBAC Admin Restricted).
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>GET /api/users:</b> Retrieves all registered user accounts.</li>
 *   <li><b>POST /api/users:</b> Provisions a new user account with a temporary secure password.</li>
 *   <li><b>PUT /api/users/{id}:</b> Updates user credentials, name, email, or role.</li>
 *   <li><b>DELETE /api/users/{id}:</b> Removes a user account and cascades deletions.</li>
 * </ul>
 * </p>
 */
@WebServlet("/api/users/*")
public class UsersServlet extends ApiServlet {

    private final UserDAO users;

    /**
     * Constructs UsersServlet with UserDAO dependency.
     */
    public UsersServlet() {
        this.users = new UserDAO();
    }

    /**
     * Handles GET requests: retrieves list of all users for the admin dashboard.
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        send(resp, 200, users.findAll());
    }

    /**
     * Handles POST requests: provisions a new patient or doctor account.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        JsonObject b = body(req);

        String name = str(b, "name");
        String email = str(b, "email").toLowerCase();
        String role = str(b, "role");

        validateUserInputs(name, email, role);

        if (users.emailTaken(email, 0)) {
            throw new ApiException(409, "A user with this email address already exists.");
        }

        String tempPassword = "Aura@" + (1000 + (int) (Math.random() * 9000));
        String defaultSpec = "doctor".equalsIgnoreCase(role) ? "General Physician" : null;
        User u = users.create(name, email, tempPassword, role, defaultSpec);

        send(resp, 201, Map.of(
            "message", "User created successfully.",
            "temporaryPassword", tempPassword,
            "user", u
        ));
    }

    /**
     * Handles PUT requests: updates existing user information.
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        int id = idFrom(req);
        JsonObject b = body(req);

        String name = str(b, "name");
        String email = str(b, "email").toLowerCase();
        String role = str(b, "role");

        validateUserInputs(name, email, role);

        if (users.emailTaken(email, id)) {
            throw new ApiException(409, "Another account is already registered with this email address.");
        }
        if (!users.adminUpdate(id, name, email, role)) {
            throw new ApiException(404, "User record not found.");
        }

        send(resp, 200, Map.of("message", "User updated successfully."));
    }

    /**
     * Handles DELETE requests: removes a user account.
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "admin");
        if (!users.delete(idFrom(req))) {
            throw new ApiException(404, "User record not found.");
        }
        send(resp, 200, Map.of("message", "User deleted successfully."));
    }

    /**
     * Validates required user input parameters.
     */
    private void validateUserInputs(String name, String email, String role) {
        if (name.isEmpty() || !email.contains("@") || !(role.equalsIgnoreCase("patient") || role.equalsIgnoreCase("doctor"))) {
            throw new ApiException(400, "Valid full name, email format, and role ('patient' or 'doctor') are required.");
        }
    }
}

