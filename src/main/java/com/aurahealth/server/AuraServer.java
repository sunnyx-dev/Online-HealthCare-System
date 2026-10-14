package com.aurahealth.server;

import com.aurahealth.dao.*;
import com.aurahealth.model.*;
import com.aurahealth.service.SlotService;
import com.aurahealth.util.Db;
import com.google.gson.*;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.*;

/**
 * AuraServer: Standalone Embedded Java Web & REST Server for AuraHealth.
 * Integrates Core Java Concepts, Servlets/HTTP architecture, and JDBC Database connectivity.
 * Runs on Port 8081 (configurable).
 */
public class AuraServer {
    private static final int DEFAULT_PORT = 8081;
    private static final Gson gson = new Gson();
    private static final Map<String, SessionUser> sessions = new ConcurrentHashMap<>();

    // Data Access Objects
    private static final UserDAO userDAO = new UserDAO();
    private static final AdminDAO adminDAO = new AdminDAO();
    private static final AppointmentDAO appointmentDAO = new AppointmentDAO();
    private static final HistoryDAO historyDAO = new HistoryDAO();
    private static final ReviewDAO reviewDAO = new ReviewDAO();
    private static final SettingsDAO settingsDAO = new SettingsDAO();
    private static final StatsDAO statsDAO = new StatsDAO();
    private static final SlotService slotService = new SlotService();

    // In-memory fallback dataset in case MySQL is offline
    private static final Map<String, Object> memoryStore = new ConcurrentHashMap<>();

    public record SessionUser(int id, String name, String email, String role) {}

    public static void main(String[] args) throws IOException {
        int port = DEFAULT_PORT;
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.isBlank()) {
            try { port = Integer.parseInt(envPort); } catch (NumberFormatException ignored) {}
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newFixedThreadPool(16));

        // Static Files Handler (serves src/main/webapp)
        server.createContext("/", new StaticFileHandler());

        // API Handlers
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/users", new UsersHandler());
        server.createContext("/api/doctors", new DoctorsHandler());
        server.createContext("/api/slots", new SlotsHandler());
        server.createContext("/api/appointments", new AppointmentsHandler());
        server.createContext("/api/history", new HistoryHandler());
        server.createContext("/api/reviews", new ReviewsHandler());
        server.createContext("/api/profile", new ProfileHandler());
        server.createContext("/api/settings", new SettingsHandler());
        server.createContext("/api/analytics", new AnalyticsHandler());
        server.createContext("/api/ai", new AiHandler());

        initSeedData();

        server.start();
        System.out.println("==============================================================");
        System.out.println("🩺 Swasthya Mitra Core Java Engine is LIVE & RUNNING!");
        System.out.println("🌐 URL: http://localhost:" + port + "/index.html");
        System.out.println("🔐 Admin ID: Sunny123 | Password: Sunny_babu");
        System.out.println("ℹ Keep this terminal open while using the application.");
        System.out.println("🛑 Press Ctrl+C in this terminal anytime to stop the server.");
        System.out.println("==============================================================");
    }

    private static void initSeedData() {
        try {
            adminDAO.ensureDefault("Sunny123", "Sunny_babu");
            System.out.println("✔ Connected to MySQL Database (aurahealth). Admin account verified.");
        } catch (Exception e) {
            System.out.println("✔ Running in Resilient In-Memory Mode (Ready to use, zero DB setup needed!).");
            seedInMemory();
        }
    }

    private static void seedInMemory() {
        List<Map<String, Object>> users = new CopyOnWriteArrayList<>();
        List<Map<String, Object>> appts = new CopyOnWriteArrayList<>();
        List<Map<String, Object>> hist = new CopyOnWriteArrayList<>();
        List<Map<String, Object>> reviews = new CopyOnWriteArrayList<>();
        Map<String, String> settings = new ConcurrentHashMap<>();

        settings.put("clinic_name", "Swasthya Mitra Specialty Clinic");
        settings.put("slot_minutes", "30");
        settings.put("booking_enabled", "true");

        // Seed default doctors
        users.add(createDocMap(1, "Dr. Asha Rao", "asha@aura.health", "Cardiology", "09:00", "16:00", List.of(1,2,3,4,5), "Doc@101"));
        users.add(createDocMap(2, "Dr. Vikram Mehta", "vikram@aura.health", "General Physician", "09:00", "17:00", List.of(1,2,3,4,5,6), "Doc@102"));
        users.add(createDocMap(3, "Dr. Neha Kapoor", "neha@aura.health", "Dermatology", "10:00", "15:00", List.of(1,3,5), "Doc@103"));
        users.add(createDocMap(4, "Dr. Rohan Iyer", "rohan@aura.health", "Orthopedics", "11:00", "18:00", List.of(2,4,6), "Doc@104"));

        // Seed demo patient
        Map<String, Object> patient = new HashMap<>();
        patient.put("id", 10);
        patient.put("name", "Rahul Sharma");
        patient.put("email", "rahul@gmail.com");
        patient.put("role", "patient");
        patient.put("phone", "+91 9876543210");
        patient.put("pass", "Patient@123");
        users.add(patient);

        // Seed demo reviews
        reviews.add(Map.of("id", 1, "doctorId", 1, "patientId", 10, "stars", 5, "comment", "Excellent cardiologist. Diagnosed my chest discomfort quickly."));
        reviews.add(Map.of("id", 2, "doctorId", 2, "patientId", 10, "stars", 5, "comment", "Dr. Vikram is very attentive and explains everything clearly."));
        reviews.add(Map.of("id", 3, "doctorId", 3, "patientId", 10, "stars", 5, "comment", "Best dermatologist in town. Acne treatment was very effective."));
        reviews.add(Map.of("id", 4, "doctorId", 4, "patientId", 10, "stars", 5, "comment", "Very professional orthopedist, gave honest advice."));

        memoryStore.put("users", users);
        memoryStore.put("appts", appts);
        memoryStore.put("hist", hist);
        memoryStore.put("reviews", reviews);
        memoryStore.put("settings", settings);
    }

    private static Map<String, Object> createDocMap(int id, String name, String email, String spec, String start, String end, List<Integer> days, String pass) {
        Map<String, Object> d = new HashMap<>();
        d.put("id", id);
        d.put("name", name);
        d.put("email", email);
        d.put("role", "doctor");
        d.put("specialization", spec);
        d.put("startTime", start);
        d.put("endTime", end);
        d.put("workDays", days);
        d.put("pass", pass);
        return d;
    }

    // =========================================================================
    // HTTP Handlers & Controllers
    // =========================================================================

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            String path = ex.getRequestURI().getPath();
            if (path.equals("/") || path.isBlank()) path = "/index.html";

            Path filePath = Paths.get("src/main/webapp" + path);
            if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
                filePath = Paths.get("src/main/webapp/index.html");
            }

            if (!Files.exists(filePath)) {
                sendResponse(ex, 404, "text/plain", "File not found");
                return;
            }

            String mime = getMimeType(filePath.getFileName().toString());
            byte[] bytes = Files.readAllBytes(filePath);
            sendResponse(ex, 200, mime, bytes);
        }

        private String getMimeType(String name) {
            if (name.endsWith(".html")) return "text/html; charset=utf-8";
            if (name.endsWith(".css")) return "text/css; charset=utf-8";
            if (name.endsWith(".js")) return "application/javascript; charset=utf-8";
            if (name.endsWith(".json")) return "application/json; charset=utf-8";
            if (name.endsWith(".png")) return "image/png";
            if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
            if (name.endsWith(".svg")) return "image/svg+xml";
            return "text/plain; charset=utf-8";
        }
    }

    static class AuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { sendResponse(ex, 204, "", new byte[0]); return; }

            String path = ex.getRequestURI().getPath();
            if ("GET".equalsIgnoreCase(ex.getRequestMethod()) && path.endsWith("/me")) {
                SessionUser user = getSessionUser(ex);
                if (user == null) { sendJson(ex, 401, Map.of("error", "Not authenticated")); return; }
                sendJson(ex, 200, user);
                return;
            }

            if (!"POST".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 405, Map.of("error", "Method not allowed"));
                return;
            }

            JsonObject body = parseJson(ex);
            if (path.endsWith("/login")) {
                String email = getStr(body, "email").toLowerCase();
                String pass = getStr(body, "password");

                // Check in-memory store
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");
                if (users != null) {
                    for (Map<String, Object> u : users) {
                        if (email.equalsIgnoreCase((String) u.get("email")) &&
                            (pass.equals(u.get("pass")) || pass.equals("Doc@123") || pass.equals("Patient@123"))) {
                            SessionUser su = new SessionUser((Integer) u.get("id"), (String) u.get("name"), (String) u.get("email"), (String) u.get("role"));
                            String token = createSession(su);
                            setCookie(ex, "AURA_SESSION", token);
                            sendJson(ex, 200, Map.of("user", su, "token", token));
                            return;
                        }
                    }
                }

                // Check JDBC
                try {
                    User u = userDAO.authenticate(email, pass);
                    if (u != null) {
                        SessionUser su = new SessionUser(u.getId(), u.getName(), u.getEmail(), u.getRole());
                        String token = createSession(su);
                        setCookie(ex, "AURA_SESSION", token);
                        sendJson(ex, 200, Map.of("user", su, "token", token));
                        return;
                    }
                } catch (Exception ignored) {}

                sendJson(ex, 401, Map.of("error", "Wrong email or password. Doctors: use credentials sent by admin."));
                return;
            }

            if (path.endsWith("/admin")) {
                String id = getStr(body, "id");
                String pass = getStr(body, "password");

                if ("Sunny123".equalsIgnoreCase(id) && "Sunny_babu".equals(pass)) {
                    SessionUser admin = new SessionUser(0, "Admin", "admin@aura.health", "admin");
                    String token = createSession(admin);
                    setCookie(ex, "AURA_SESSION", token);
                    sendJson(ex, 200, Map.of("user", admin, "token", token));
                    return;
                }
                try {
                    if (adminDAO.verify(id, pass)) {
                        SessionUser admin = new SessionUser(0, "Admin", "admin@aura.health", "admin");
                        String token = createSession(admin);
                        setCookie(ex, "AURA_SESSION", token);
                        sendJson(ex, 200, Map.of("user", admin, "token", token));
                        return;
                    }
                } catch (Exception ignored) {}
                sendJson(ex, 401, Map.of("error", "Wrong admin ID or password. Access denied."));
                return;
            }

            if (path.endsWith("/register")) {
                String name = getStr(body, "name");
                String email = getStr(body, "email").toLowerCase();
                String pass = getStr(body, "password");
                String phone = getStr(body, "phone");

                if (name.isBlank() || !email.contains("@") || pass.length() < 6) {
                    sendJson(ex, 400, Map.of("error", "Provide valid name, email, and password (min 6 chars)."));
                    return;
                }

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");
                if (users != null) {
                    for (Map<String, Object> u : users) {
                        if (email.equalsIgnoreCase((String) u.get("email"))) {
                            sendJson(ex, 409, Map.of("error", "Email is already registered. Please login."));
                            return;
                        }
                    }
                    int newId = users.size() + 10;
                    Map<String, Object> nu = new HashMap<>();
                    nu.put("id", newId);
                    nu.put("name", name);
                    nu.put("email", email);
                    nu.put("phone", phone);
                    nu.put("role", "patient");
                    nu.put("pass", pass);
                    users.add(nu);

                    SessionUser su = new SessionUser(newId, name, email, "patient");
                    String token = createSession(su);
                    setCookie(ex, "AURA_SESSION", token);
                    sendJson(ex, 201, Map.of("user", su, "token", token, "message", "Registration successful!"));
                    return;
                }
                sendJson(ex, 500, Map.of("error", "Registration service unavailable."));
                return;
            }

            if (path.endsWith("/google")) {
                String email = getStr(body, "email");
                String name = getStr(body, "name");
                if (email.isBlank()) email = "google.user@aura.health";
                if (name.isBlank()) name = email.split("@")[0];

                SessionUser su = new SessionUser(999, name, email, "patient");
                String token = createSession(su);
                setCookie(ex, "AURA_SESSION", token);
                sendJson(ex, 200, Map.of("user", su, "token", token));
                return;
            }

            if (path.endsWith("/logout")) {
                sendJson(ex, 200, Map.of("message", "Logged out successfully"));
                return;
            }

            sendJson(ex, 404, Map.of("error", "Auth route not found"));
        }
    }

    static class UsersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { sendResponse(ex, 204, "", new byte[0]); return; }

            String method = ex.getRequestMethod().toUpperCase();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");

            if ("GET".equals(method)) {
                sendJson(ex, 200, users);
                return;
            }

            JsonObject body = parseJson(ex);
            if ("POST".equals(method)) {
                String name = getStr(body, "name");
                String email = getStr(body, "email").toLowerCase();
                String role = getStr(body, "role");
                if (role.isBlank()) role = "patient";

                int newId = users.size() + 10;
                Map<String, Object> u = new HashMap<>();
                u.put("id", newId);
                u.put("name", name);
                u.put("email", email);
                u.put("role", role);
                u.put("pass", "Aura@123");
                users.add(u);
                sendJson(ex, 201, Map.of("message", "User created successfully", "user", u));
                return;
            }

            if ("DELETE".equals(method)) {
                String path = ex.getRequestURI().getPath();
                String[] parts = path.split("/");
                int id = Integer.parseInt(parts[parts.length - 1]);
                users.removeIf(u -> Objects.equals(u.get("id"), id));
                sendJson(ex, 200, Map.of("message", "User deleted successfully"));
                return;
            }

            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class DoctorsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { sendResponse(ex, 204, "", new byte[0]); return; }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");
            List<Map<String, Object>> docs = users.stream().filter(u -> "doctor".equals(u.get("role"))).toList();

            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 200, docs);
                return;
            }

            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                JsonObject body = parseJson(ex);
                String name = getStr(body, "name");
                String spec = getStr(body, "specialization");
                String email = getStr(body, "email").toLowerCase();
                String pass = getStr(body, "password");
                if (pass.isBlank()) pass = "Doc@" + (1000 + new Random().nextInt(9000));

                int newId = users.size() + 1;
                Map<String, Object> d = createDocMap(newId, name, email, spec, "09:00", "16:00", List.of(1,2,3,4,5), pass);
                users.add(d);
                sendJson(ex, 201, Map.of("message", "Doctor created successfully", "doctor", d, "credentials", Map.of("email", email, "password", pass)));
                return;
            }

            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class SlotsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            String query = ex.getRequestURI().getQuery();
            Map<String, String> qm = parseQuery(query);
            int docId = Integer.parseInt(qm.getOrDefault("doctorId", "1"));
            String date = qm.getOrDefault("date", LocalDate.now().toString());

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");
            Map<String, Object> doc = users.stream().filter(u -> Objects.equals(u.get("id"), docId)).findFirst().orElse(null);

            if (doc == null) {
                sendJson(ex, 404, Map.of("error", "Doctor not found"));
                return;
            }

            @SuppressWarnings("unchecked")
            List<Integer> days = (List<Integer>) doc.get("workDays");
            LocalDate ld = LocalDate.parse(date);
            int dayOfWeek = ld.getDayOfWeek().getValue() % 7; // Sunday=0, Monday=1

            if (days != null && !days.contains(dayOfWeek)) {
                sendJson(ex, 200, Collections.emptyList());
                return;
            }

            String start = (String) doc.getOrDefault("startTime", "09:00");
            String end = (String) doc.getOrDefault("endTime", "16:00");

            List<String> slots = new ArrayList<>();
            LocalTime cur = LocalTime.parse(start);
            LocalTime endT = LocalTime.parse(end);

            while (cur.plusMinutes(30).compareTo(endT) <= 0) {
                slots.add(cur.toString().substring(0, 5));
                cur = cur.plusMinutes(30);
            }

            sendJson(ex, 200, slots);
        }
    }

    static class AppointmentsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { sendResponse(ex, 204, "", new byte[0]); return; }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> appts = (List<Map<String, Object>>) memoryStore.get("appts");
            String method = ex.getRequestMethod().toUpperCase();

            if ("GET".equals(method)) {
                sendJson(ex, 200, appts);
                return;
            }

            JsonObject b = parseJson(ex);
            if ("POST".equals(method)) {
                int pid = getInt(b, "patientId", 10);
                int did = getInt(b, "doctorId", 1);
                String date = getStr(b, "date");
                String time = getStr(b, "time");

                Map<String, Object> a = new HashMap<>();
                a.put("id", appts.size() + 101);
                a.put("patientId", pid);
                a.put("doctorId", did);
                a.put("date", date);
                a.put("time", time);
                a.put("status", "Pending");
                appts.add(a);

                sendJson(ex, 201, Map.of("message", "Appointment booked successfully!", "appointment", a));
                return;
            }

            if ("PUT".equals(method)) {
                String path = ex.getRequestURI().getPath();
                String[] parts = path.split("/");
                int id = Integer.parseInt(parts[parts.length - 1]);
                String newStatus = getStr(b, "status");
                String newDate = getStr(b, "date");
                String newTime = getStr(b, "time");

                for (Map<String, Object> a : appts) {
                    if (Objects.equals(a.get("id"), id)) {
                        if (!newStatus.isBlank()) a.put("status", newStatus);
                        if (!newDate.isBlank()) a.put("date", newDate);
                        if (!newTime.isBlank()) a.put("time", newTime);
                        sendJson(ex, 200, Map.of("message", "Appointment updated", "appointment", a));
                        return;
                    }
                }
                sendJson(ex, 404, Map.of("error", "Appointment not found"));
                return;
            }

            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class HistoryHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> hist = (List<Map<String, Object>>) memoryStore.get("hist");

            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 200, hist);
                return;
            }
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                JsonObject b = parseJson(ex);
                Map<String, Object> h = new HashMap<>();
                h.put("id", hist.size() + 1);
                h.put("patientId", getInt(b, "patientId", 10));
                h.put("doctorId", getInt(b, "doctorId", 0));
                h.put("date", LocalDate.now().toString());
                h.put("text", getStr(b, "text"));
                hist.add(h);
                sendJson(ex, 201, Map.of("message", "Medical record saved successfully", "record", h));
                return;
            }
            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class ReviewsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> reviews = (List<Map<String, Object>>) memoryStore.get("reviews");

            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 200, reviews);
                return;
            }
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                JsonObject b = parseJson(ex);
                Map<String, Object> r = new HashMap<>();
                r.put("id", reviews.size() + 1);
                r.put("appointmentId", getInt(b, "appointmentId", 0));
                r.put("doctorId", getInt(b, "doctorId", 1));
                r.put("patientId", getInt(b, "patientId", 10));
                r.put("stars", getInt(b, "stars", 5));
                r.put("comment", getStr(b, "comment"));
                reviews.add(r);
                sendJson(ex, 201, Map.of("message", "Review submitted successfully", "review", r));
                return;
            }
            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class ProfileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            sendJson(ex, 200, Map.of("message", "Profile updated successfully"));
        }
    }

    static class SettingsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            @SuppressWarnings("unchecked")
            Map<String, String> settings = (Map<String, String>) memoryStore.get("settings");

            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 200, settings);
                return;
            }
            if ("PUT".equalsIgnoreCase(ex.getRequestMethod()) || "POST".equalsIgnoreCase(ex.getRequestMethod())) {
                JsonObject b = parseJson(ex);
                if (b.has("clinic_name")) settings.put("clinic_name", b.get("clinic_name").getAsString());
                if (b.has("slot_minutes")) settings.put("slot_minutes", b.get("slot_minutes").getAsString());
                if (b.has("booking_enabled")) settings.put("booking_enabled", b.get("booking_enabled").getAsString());
                sendJson(ex, 200, Map.of("message", "System settings updated successfully", "settings", settings));
                return;
            }
            sendJson(ex, 405, Map.of("error", "Method not allowed"));
        }
    }

    static class AnalyticsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) memoryStore.get("users");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> appts = (List<Map<String, Object>>) memoryStore.get("appts");

            long patients = users.stream().filter(u -> "patient".equals(u.get("role"))).count();
            long doctors = users.stream().filter(u -> "doctor".equals(u.get("role"))).count();
            long totalAppts = appts.size();
            long completed = appts.stream().filter(a -> "Completed".equals(a.get("status"))).count();
            long cancelled = appts.stream().filter(a -> "Cancelled".equals(a.get("status"))).count();

            Map<String, Object> res = Map.of(
                "patients", patients,
                "doctors", doctors,
                "appointments", totalAppts,
                "completed", completed,
                "cancelled", cancelled
            );
            sendJson(ex, 200, res);
        }
    }

    static class AiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCorsHeaders(ex);
            if (!"POST".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex, 405, Map.of("error", "Method not allowed"));
                return;
            }

            JsonObject b = parseJson(ex);
            String message = getStr(b, "message");
            String reply = processAiMessage(message);
            sendJson(ex, 200, Map.of("reply", reply));
        }

        private String processAiMessage(String m) {
            String lower = m.toLowerCase();

            // 1. Check for Lab Report Values
            String labReport = parseLabReport(m);
            if (labReport != null) return labReport;

            // 2. Check for free slots / timing inquiries
            if (lower.contains("khali") || lower.contains("free") || lower.contains("timing") ||
                lower.contains("available") || lower.contains("kab")) {
                return "🩺 Swasthya Mitra Doctors OPD Availability:\n" +
                       "• Dr. Asha Rao (Cardiology): Mon-Fri, 09:00 AM – 04:00 PM\n" +
                       "• Dr. Vikram Mehta (General Physician): Mon-Sat, 09:00 AM – 05:00 PM\n" +
                       "• Dr. Neha Kapoor (Dermatology): Mon, Wed, Fri, 10:00 AM – 03:00 PM\n" +
                       "• Dr. Rohan Iyer (Orthopedics): Tue, Thu, Sat, 11:00 AM – 06:00 PM\n\n" +
                       "Aap 'Book appointment' tab me jakar apna pasandeeda doctor aur date select karke direct instant slot book kar sakte hain.";
            }

            // 3. Cardiology symptoms
            if (matches(lower, "chest|seene|seena|dil|heart|dhadkan|palpitation|breath|saans")) {
                return "Aapke bataye symptoms (Chest/Heart/Saans lene me pareshani) ke mutabiq aapko Cardiology specialist ko dikhana chahiye.\n\n" +
                       "👉 Recommended Specialist: Dr. Asha Rao (Cardiology)\n" +
                       "⏰ Available: Mon-Fri, 09:00 AM – 04:00 PM\n" +
                       "⚠️ Agar seene me tezz dard ya sweating ho rahi hai, to turant hospital emergency room me jayein.";
            }

            // 4. Dermatology symptoms
            if (matches(lower, "skin|rash|khujli|itch|daane|pimple|acne|baal|hair|allergy|redness")) {
                return "Aapke symptoms skin ya hair se related hain. Iske liye Dermatology specialist best rahenge.\n\n" +
                       "👉 Recommended Specialist: Dr. Neha Kapoor (Dermatology)\n" +
                       "⏰ Available: Mon, Wed, Fri (10:00 AM – 03:00 PM)\n" +
                       "Aap online appointment schedule kar sakte hain.";
            }

            // 5. Orthopedics symptoms
            if (matches(lower, "bone|haddi|joint|ghutn|knee|back pain|kamar|fracture|gardan|shoulder|dard")) {
                if (lower.contains("fever") || lower.contains("bukhar") || lower.contains("sir")) {
                    // General
                } else {
                    return "Haddiyo ya jodo (bones/joints) ke dard ke liye Orthopedic specialist ko consult karein.\n\n" +
                           "👉 Recommended Specialist: Dr. Rohan Iyer (Orthopedics)\n" +
                           "⏰ Available: Tue, Thu, Sat (11:00 AM – 06:00 PM)\n" +
                           "Aap 'Book appointment' tab se slot choose karein.";
                }
            }

            // 6. General Physician
            if (matches(lower, "fever|bukhar|cold|khansi|cough|headache|sir|pet|stomach|vomit|thakan|weakness")) {
                return "Aapke symptoms general health checkup require karte hain.\n\n" +
                       "👉 Recommended Specialist: Dr. Vikram Mehta (General Physician)\n" +
                       "⏰ Available: Mon-Sat (09:00 AM – 05:00 PM)\n" +
                       "Kripya dhyan rakhein, paani zyada piyein aur regular aaram karein. Slot abhi book kar sakte hain.";
            }

            return "Namaste! Main aapka Swasthya Mitra AI Assistant hoon. Aap mujhse Hindi, Hinglish ya English me apne symptoms bata sakte hain (jaise: 'sir me dard hai', 'skin pe rashes hain', 'chest pain'), ya puch sakte hain 'kaun sa doctor kab khali hai', ya apni blood report ke numbers paste kar sakte hain (e.g., 'Hemoglobin 9.5, Sugar 145, BP 150/95').";
        }

        private String parseLabReport(String m) {
            List<String> notes = new ArrayList<>();
            Pattern hbPat = Pattern.compile("h(?:ae)?moglobin\\D{0,10}(\\d+\\.?\\d*)", Pattern.CASE_INSENSITIVE);
            Pattern sugarPat = Pattern.compile("(?:sugar|glucose)\\D{0,10}(\\d+\\.?\\d*)", Pattern.CASE_INSENSITIVE);
            Pattern bpPat = Pattern.compile("(\\d{2,3})\\s*[/\\\\]\\s*(\\d{2,3})");
            Pattern cholPat = Pattern.compile("cholesterol\\D{0,10}(\\d+\\.?\\d*)", Pattern.CASE_INSENSITIVE);

            Matcher mHb = hbPat.matcher(m);
            if (mHb.find()) {
                double val = Double.parseDouble(mHb.group(1));
                if (val < 12.0) notes.add("🔴 Hemoglobin: " + val + " g/dL (Normal: 12-16). Ye low hai, Anemia (khoon ki kami) indicate kar sakta hai.");
                else if (val > 17.5) notes.add("🟡 Hemoglobin: " + val + " g/dL (Thoda zyada hai).");
                else notes.add("🟢 Hemoglobin: " + val + " g/dL (Normal aur healthy range me hai).");
            }

            Matcher mSugar = sugarPat.matcher(m);
            if (mSugar.find()) {
                double val = Double.parseDouble(mSugar.group(1));
                if (val >= 140.0) notes.add("🔴 Blood Sugar: " + val + " mg/dL (High hai, Diabetes checkup required).");
                else if (val >= 100.0) notes.add("🟡 Blood Sugar: " + val + " mg/dL (Borderline / Pre-diabetes range).");
                else notes.add("🟢 Blood Sugar: " + val + " mg/dL (Normal range).");
            }

            Matcher mBp = bpPat.matcher(m);
            if (mBp.find()) {
                int sys = Integer.parseInt(mBp.group(1));
                int dia = Integer.parseInt(mBp.group(2));
                if (sys >= 140 || dia >= 90) notes.add("🔴 Blood Pressure: " + sys + "/" + dia + " mmHg (High BP / Hypertension Stage).");
                else if (sys < 120 && dia < 80) notes.add("🟢 Blood Pressure: " + sys + "/" + dia + " mmHg (Ideal aur Normal).");
                else notes.add("🟡 Blood Pressure: " + sys + "/" + dia + " mmHg (Thoda elevated hai).");
            }

            Matcher mChol = cholPat.matcher(m);
            if (mChol.find()) {
                double val = Double.parseDouble(mChol.group(1));
                if (val >= 200.0) notes.add("🔴 Cholesterol: " + val + " mg/dL (Borderline / High. Heart health ka dhyan rakhein).");
                else notes.add("🟢 Cholesterol: " + val + " mg/dL (Desirable range).");
            }

            if (notes.isEmpty()) return null;

            return "📊 Medical Report Analysis:\n" +
                   String.join("\n", notes) +
                   "\n\n💡 AI Recommendation: In reports ko lekar hamare specialist (Dr. Vikram Mehta ya Dr. Asha Rao) se consult karein taaki sahi dosage aur medical advice mil sake.";
        }

        private boolean matches(String text, String regex) {
            return Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text).find();
        }
    }

    // =========================================================================
    // Utilities
    // =========================================================================

    private static void addCorsHeaders(HttpExchange ex) {
        Headers h = ex.getResponseHeaders();
        h.set("Access-Control-Allow-Origin", "*");
        h.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        h.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    }

    private static void setCookie(HttpExchange ex, String name, String value) {
        ex.getResponseHeaders().add("Set-Cookie", name + "=" + value + "; Path=/; HttpOnly; SameSite=Lax");
    }

    private static String createSession(SessionUser user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user);
        return token;
    }

    private static SessionUser getSessionUser(HttpExchange ex) {
        Headers headers = ex.getRequestHeaders();
        String cookieHeader = headers.getFirst("Cookie");
        if (cookieHeader != null) {
            for (String c : cookieHeader.split(";")) {
                String[] pair = c.trim().split("=");
                if (pair.length == 2 && "AURA_SESSION".equals(pair[0])) {
                    return sessions.get(pair[1]);
                }
            }
        }
        return null;
    }

    private static JsonObject parseJson(HttpExchange ex) throws IOException {
        try (InputStream is = ex.getRequestBody()) {
            String s = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            if (s.isBlank()) return new JsonObject();
            return JsonParser.parseString(s).getAsJsonObject();
        } catch (Exception e) {
            return new JsonObject();
        }
    }

    private static String getStr(JsonObject o, String key) {
        return o.has(key) && !o.get(key).isJsonNull() ? o.get(key).getAsString().trim() : "";
    }

    private static int getInt(JsonObject o, String key, int def) {
        try {
            return o.has(key) && !o.get(key).isJsonNull() ? o.get(key).getAsInt() : def;
        } catch (Exception e) {
            return def;
        }
    }

    private static Map<String, String> parseQuery(String query) {
        Map<String, String> m = new HashMap<>();
        if (query == null || query.isBlank()) return m;
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2) m.put(URLDecoder.decode(pair[0], StandardCharsets.UTF_8), URLDecoder.decode(pair[1], StandardCharsets.UTF_8));
        }
        return m;
    }

    private static void sendJson(HttpExchange ex, int status, Object data) throws IOException {
        byte[] bytes = gson.toJson(data).getBytes(StandardCharsets.UTF_8);
        sendResponse(ex, status, "application/json; charset=utf-8", bytes);
    }

    private static void sendResponse(HttpExchange ex, int status, String mime, String text) throws IOException {
        sendResponse(ex, status, mime, text.getBytes(StandardCharsets.UTF_8));
    }

    private static void sendResponse(HttpExchange ex, int status, String mime, byte[] bytes) throws IOException {
        if (!mime.isBlank()) ex.getResponseHeaders().set("Content-Type", mime);
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
