package com.aurahealth.servlet;

import com.aurahealth.util.ApiException;
import com.aurahealth.util.DataException;
import com.google.gson.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;

/**
 * Abstract Base Controller for AuraHealth REST API Servlets.
 * <p>
 * Provides standardized HTTP infrastructure across all backend endpoints:
 * <ul>
 *   <li><b>JSON Serialization & Deserialization:</b> Reusable Gson converters for request and response payloads.</li>
 *   <li><b>Session & RBAC (Role-Based Access Control):</b> Role inspection via {@link #require(HttpServletRequest, String...)}.</li>
 *   <li><b>Session Fixation Protection:</b> Automatically rotates session IDs upon user login via {@link HttpServletRequest#changeSessionId()}.</li>
 *   <li><b>Uniform Error Translation:</b> Converts {@link ApiException} and {@link DataException} into structured JSON responses.</li>
 * </ul>
 * </p>
 */
public abstract class ApiServlet extends HttpServlet {

    /** Shared Google Gson serializer/deserializer. */
    protected static final Gson G = new Gson();

    /**
     * Immutable session representation of an authenticated user.
     *
     * @param id user primary key ID
     * @param name user full display name
     * @param role security role ('patient', 'doctor', 'admin')
     */
    public record SessionUser(int id, String name, String role) implements Serializable {}

    /**
     * Intercepts incoming HTTP requests to apply uniform exception handling and JSON error formatting.
     *
     * @param req standard HTTP servlet request
     * @param resp standard HTTP servlet response
     * @throws ServletException if a servlet engine error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            super.service(req, resp);
        } catch (ApiException e) {
            send(resp, e.status, Map.of("error", e.getMessage()));
        } catch (DataException e) {
            log("Database error encountered during request execution", e);
            send(resp, 500, Map.of("error", "An internal server error occurred. Please try again."));
        }
    }

    /**
     * Writes a Java object as a JSON response with HTTP status code and UTF-8 encoding.
     *
     * @param r servlet response
     * @param code HTTP status code (e.g. 200, 201, 400, 401, 403, 404, 500)
     * @param body object to serialize to JSON
     * @throws IOException if writing to output stream fails
     */
    protected void send(HttpServletResponse r, int code, Object body) throws IOException {
        r.setStatus(code);
        r.setContentType("application/json");
        r.setCharacterEncoding("UTF-8");
        r.getWriter().write(G.toJson(body));
    }

    /**
     * Parses the incoming HTTP request body into a {@link JsonObject}.
     *
     * @param r servlet request
     * @return parsed JsonObject, or an empty JsonObject if body was empty
     * @throws IOException if reading input stream fails
     * @throws ApiException if the body is not well-formed JSON
     */
    protected JsonObject body(HttpServletRequest r) throws IOException {
        try (BufferedReader br = r.getReader()) {
            JsonElement e = JsonParser.parseReader(br);
            return e != null && e.isJsonObject() ? e.getAsJsonObject() : new JsonObject();
        } catch (JsonParseException ex) {
            throw new ApiException(400, "Request payload is not valid JSON.");
        }
    }

    /**
     * Safely extracts a trimmed String value from a JsonObject by key.
     *
     * @param o JsonObject
     * @param k property key name
     * @return string value or empty string if absent or null
     */
    protected String str(JsonObject o, String k) {
        return o.has(k) && !o.get(k).isJsonNull() ? o.get(k).getAsString().trim() : "";
    }

    /**
     * Parses an integer property from a JsonObject by key.
     *
     * @param o JsonObject
     * @param k property key name
     * @return integer value
     * @throws ApiException if property cannot be parsed as a number
     */
    protected int num(JsonObject o, String k) {
        try {
            return Integer.parseInt(str(o, k));
        } catch (NumberFormatException e) {
            throw new ApiException(400, "Field '" + k + "' must be a valid integer.");
        }
    }

    /**
     * Extracts the sub-path following the servlet mapping (e.g., "/api/users/5" returns "5").
     *
     * @param r servlet request
     * @return stripped sub-path string
     */
    protected String sub(HttpServletRequest r) {
        String p = r.getPathInfo();
        return (p == null || p.equals("/")) ? "" : p.substring(1);
    }

    /**
     * Extracts a numeric ID from the URL path info (e.g., "/api/appointments/42" -> 42).
     *
     * @param r servlet request
     * @return parsed entity integer ID
     * @throws ApiException if path info is missing or non-numeric
     */
    protected int idFrom(HttpServletRequest r) {
        try {
            return Integer.parseInt(sub(r));
        } catch (NumberFormatException e) {
            throw new ApiException(400, "A valid numeric ID is required in the URL path.");
        }
    }

    /**
     * Retrieves the current authenticated {@link SessionUser} from the session without creating a new session.
     *
     * @param r servlet request
     * @return authenticated SessionUser, or null if unauthenticated
     */
    protected SessionUser user(HttpServletRequest r) {
        HttpSession s = r.getSession(false);
        return s == null ? null : (SessionUser) s.getAttribute("user");
    }

    /**
     * Enforces authentication and optional Role-Based Access Control (RBAC).
     *
     * @param r servlet request
     * @param roles allowed roles; if empty, any authenticated user is permitted
     * @return the authenticated {@link SessionUser}
     * @throws ApiException 401 if unauthenticated, 403 if user lacks required role
     */
    protected SessionUser require(HttpServletRequest r, String... roles) {
        SessionUser u = user(r);
        if (u == null) {
            throw new ApiException(401, "Authentication required. Please log in.");
        }
        if (roles.length > 0 && !Arrays.asList(roles).contains(u.role())) {
            throw new ApiException(403, "Access denied. Insufficient privileges.");
        }
        return u;
    }

    /**
     * Establishes a new authenticated session for the given user, rotating session ID
     * to protect against session fixation attacks.
     *
     * @param r servlet request
     * @param u authenticated user info
     */
    protected void login(HttpServletRequest r, SessionUser u) {
        HttpSession s = r.getSession(true);
        r.changeSessionId();
        s.setAttribute("user", u);
    }
}

