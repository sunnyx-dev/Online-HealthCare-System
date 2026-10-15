package com.aurahealth.dao;

import com.aurahealth.model.Doctor;
import com.aurahealth.model.User;
import com.aurahealth.util.PasswordUtil;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Data Access Object for User and Doctor Entities.
 * <p>
 * Handles database operations for patient registration, doctor profile management,
 * PBKDF2 credential verification, and doctor OPD scheduling.
 * Demonstrates OOP polymorphism by mapping rows to {@link User} or {@link Doctor}
 * based on role.
 * </p>
 */
public class UserDAO extends BaseDao implements Dao<User> {

    /** Standard projection columns for user queries. */
    private static final String COLS =
        "id, name, email, role, phone, specialization, work_days, start_time, end_time";

    /**
     * Formats database TIME string (HH:mm:ss) into standard HH:mm format.
     *
     * @param t the database time string
     * @return 5-character HH:mm string, or null if input was null
     */
    private static String hhmm(String t) {
        return t == null ? null : t.substring(0, 5);
    }

    /**
     * Maps a database ResultSet row to either a {@link User} or a polymorphic {@link Doctor} instance.
     *
     * @param rs the ResultSet containing current record columns
     * @return a User or Doctor object
     * @throws SQLException if a column cannot be read
     */
    private User map(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String role = rs.getString("role");

        if (!"doctor".equalsIgnoreCase(role)) {
            return new User(id, rs.getString("name"), rs.getString("email"), role, rs.getString("phone"));
        }

        // Parse comma-separated day integers for doctors (0 = Sun, 1 = Mon ... 6 = Sat)
        List<Integer> days = new ArrayList<>();
        String rawDays = rs.getString("work_days");
        if (rawDays != null && !rawDays.isBlank()) {
            for (String d : rawDays.split(",")) {
                if (!d.trim().isEmpty()) {
                    days.add(Integer.parseInt(d.trim()));
                }
            }
        }

        return new Doctor(
            id,
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getString("specialization"),
            days,
            hhmm(rs.getString("start_time")),
            hhmm(rs.getString("end_time"))
        );
    }

    /**
     * Retrieves all registered users (patients and doctors) ordered by ID.
     *
     * @return list of all users
     */
    @Override
    public List<User> findAll() {
        return query("SELECT " + COLS + " FROM users ORDER BY id", this::map);
    }

    /**
     * Finds a user by primary key ID.
     *
     * @param id the user ID
     * @return Optional containing the user if found
     */
    @Override
    public Optional<User> findById(int id) {
        return query("SELECT " + COLS + " FROM users WHERE id=?", this::map, id).stream().findFirst();
    }

    /**
     * Retrieves all doctors in alphabetical order by name.
     *
     * @return list of Doctor entities
     */
    public List<Doctor> findDoctors() {
        List<Doctor> out = new ArrayList<>();
        for (User u : query("SELECT " + COLS + " FROM users WHERE role='doctor' ORDER BY name", this::map)) {
            if (u instanceof Doctor doc) {
                out.add(doc);
            }
        }
        return out;
    }

    /**
     * Finds a specific doctor by user ID.
     *
     * @param id the doctor's user ID
     * @return Optional containing Doctor if found and role is doctor
     */
    public Optional<Doctor> findDoctor(int id) {
        return findById(id).filter(u -> u instanceof Doctor).map(u -> (Doctor) u);
    }

    /**
     * Finds a user account by email address (case-insensitive).
     *
     * @param email user email address
     * @return Optional containing the user if found
     */
    public Optional<User> findByEmail(String email) {
        return query("SELECT " + COLS + " FROM users WHERE email=?", this::map, email.toLowerCase()).stream().findFirst();
    }

    /**
     * Authenticates user credentials using salted PBKDF2 hash verification.
     *
     * @param email user email
     * @param password raw plain-text password to verify
     * @return authenticated User/Doctor instance if credentials match; null otherwise
     */
    public User authenticate(String email, String password) {
        var rows = query(
            "SELECT id, password_hash FROM users WHERE email=?",
            rs -> new Object[]{rs.getInt(1), rs.getString(2)},
            email.toLowerCase()
        );
        if (rows.isEmpty() || !PasswordUtil.verify(password, (String) rows.get(0)[1])) {
            return null;
        }
        return findById((Integer) rows.get(0)[0]).orElse(null);
    }

    /**
     * Checks if an email is already registered to another user account.
     *
     * @param email email address to check
     * @param exceptId account ID to exclude (e.g. current user during profile updates)
     * @return true if email is already taken; false if available
     */
    public boolean emailTaken(String email, int exceptId) {
        return count("SELECT COUNT(*) FROM users WHERE email=? AND id<>?", email.toLowerCase(), exceptId) > 0;
    }

    /**
     * Creates a new user record with securely hashed password.
     *
     * @param name user full name
     * @param email unique email address
     * @param password plain text password (hashed via PBKDF2)
     * @param role user role ('patient' or 'doctor')
     * @param specialization medical specialty if doctor; null if patient
     * @return newly created User entity with generated ID
     */
    public User create(String name, String email, String password, String role, String specialization) {
        int id = insert(
            "INSERT INTO users (name, email, password_hash, role, specialization) VALUES (?, ?, ?, ?, ?)",
            name, email.toLowerCase(), PasswordUtil.hash(password), role, specialization
        );
        return findById(id).orElseThrow();
    }

    /**
     * Updates user details from the Administrator control panel.
     *
     * @param id user ID
     * @param name updated name
     * @param email updated email
     * @param role updated role
     * @return true if the row was updated
     */
    public boolean adminUpdate(int id, String name, String email, String role) {
        return update("UPDATE users SET name=?, email=?, role=? WHERE id=?", name, email.toLowerCase(), role, id) > 0;
    }

    /**
     * Updates personal profile information for an authenticated patient or doctor.
     *
     * @param id user ID
     * @param name updated name
     * @param email updated email
     * @param phone updated phone number
     * @param newPassword optional new password (hashed if provided; ignored if blank)
     */
    public void updateProfile(int id, String name, String email, String phone, String newPassword) {
        update("UPDATE users SET name=?, email=?, phone=? WHERE id=?", name, email.toLowerCase(), phone, id);
        if (newPassword != null && !newPassword.isBlank()) {
            update("UPDATE users SET password_hash=? WHERE id=?", PasswordUtil.hash(newPassword), id);
        }
    }

    /**
     * Updates doctor clinical schedule and working hours.
     *
     * @param id doctor user ID
     * @param days list of day-of-week integers (0=Sun ... 6=Sat)
     * @param start start time string (HH:mm)
     * @param end end time string (HH:mm)
     */
    public void updateSchedule(int id, List<Integer> days, String start, String end) {
        StringJoiner j = new StringJoiner(",");
        days.forEach(d -> j.add(String.valueOf(d)));
        update(
            "UPDATE users SET work_days=?, start_time=?, end_time=? WHERE id=? AND role='doctor'",
            j.toString(), start + ":00", end + ":00", id
        );
    }

    /**
     * Deletes a user account by ID. Cascading database foreign keys remove associated records.
     *
     * @param id user ID to delete
     * @return true if deleted; false if record was not found
     */
    @Override
    public boolean delete(int id) {
        return update("DELETE FROM users WHERE id=?", id) > 0;
    }
}

