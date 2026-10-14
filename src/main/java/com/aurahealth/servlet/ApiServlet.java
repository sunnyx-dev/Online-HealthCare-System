package com.aurahealth.servlet;

import com.aurahealth.util.ApiException;
import com.aurahealth.util.DataException;
import com.google.gson.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;

/** Shared helpers: JSON in/out, session user, role checks and uniform error handling. */
public abstract class ApiServlet extends HttpServlet {
    protected static final Gson G = new Gson();

    public record SessionUser(int id, String name, String role) implements Serializable {}

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try { super.service(req, resp); }
        catch (ApiException e) { send(resp, e.status, Map.of("error", e.getMessage())); }
        catch (DataException e) {
            log("Database error", e);
            send(resp, 500, Map.of("error", "Something went wrong on the server. Try again."));
        }
    }

    protected void send(HttpServletResponse r, int code, Object body) throws IOException {
        r.setStatus(code);
        r.setContentType("application/json");
        r.setCharacterEncoding("UTF-8");
        r.getWriter().write(G.toJson(body));
    }

    protected JsonObject body(HttpServletRequest r) throws IOException {
        try (BufferedReader br = r.getReader()) {
            JsonElement e = JsonParser.parseReader(br);
            return e != null && e.isJsonObject() ? e.getAsJsonObject() : new JsonObject();
        } catch (JsonParseException ex) { throw new ApiException(400, "Request body is not valid JSON."); }
    }

    protected String str(JsonObject o, String k) {
        return o.has(k) && !o.get(k).isJsonNull() ? o.get(k).getAsString().trim() : "";
    }

    protected int num(JsonObject o, String k) {
        try { return Integer.parseInt(str(o, k)); }
        catch (NumberFormatException e) { throw new ApiException(400, "'" + k + "' must be a number."); }
    }

    /** The part of the URL after the servlet mapping, e.g. "/api/users/5" -> "5". */
    protected String sub(HttpServletRequest r) {
        String p = r.getPathInfo();
        return p == null || p.equals("/") ? "" : p.substring(1);
    }

    protected int idFrom(HttpServletRequest r) {
        try { return Integer.parseInt(sub(r)); }
        catch (NumberFormatException e) { throw new ApiException(400, "A numeric id is required in the URL."); }
    }

    protected SessionUser user(HttpServletRequest r) {
        HttpSession s = r.getSession(false);
        return s == null ? null : (SessionUser) s.getAttribute("user");
    }

    protected SessionUser require(HttpServletRequest r, String... roles) {
        SessionUser u = user(r);
        if (u == null) throw new ApiException(401, "Please log in.");
        if (roles.length > 0 && !Arrays.asList(roles).contains(u.role()))
            throw new ApiException(403, "You do not have access to this.");
        return u;
    }

    protected void login(HttpServletRequest r, SessionUser u) {
        HttpSession s = r.getSession(true);
        r.changeSessionId();                       // prevents session fixation
        s.setAttribute("user", u);
    }
}
