package com.aurahealth.dao;

import com.aurahealth.model.Doctor;
import com.aurahealth.model.User;
import com.aurahealth.util.PasswordUtil;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class UserDAO extends BaseDao implements Dao<User> {
    private static final String COLS =
        "id,name,email,role,phone,specialization,work_days,start_time,end_time";

    private static String hhmm(String t) { return t == null ? null : t.substring(0, 5); }

    private User map(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String role = rs.getString("role");
        if (!"doctor".equals(role))
            return new User(id, rs.getString("name"), rs.getString("email"), role, rs.getString("phone"));
        List<Integer> days = new ArrayList<>();
        for (String d : rs.getString("work_days").split(",")) if (!d.isBlank()) days.add(Integer.parseInt(d.trim()));
        return new Doctor(id, rs.getString("name"), rs.getString("email"), rs.getString("phone"),
            rs.getString("specialization"), days, hhmm(rs.getString("start_time")), hhmm(rs.getString("end_time")));
    }

    @Override public List<User> findAll() { return query("SELECT " + COLS + " FROM users ORDER BY id", this::map); }

    @Override public Optional<User> findById(int id) {
        return query("SELECT " + COLS + " FROM users WHERE id=?", this::map, id).stream().findFirst();
    }

    public List<Doctor> findDoctors() {
        List<Doctor> out = new ArrayList<>();
        for (User u : query("SELECT " + COLS + " FROM users WHERE role='doctor' ORDER BY name", this::map))
            out.add((Doctor) u);
        return out;
    }

    public Optional<Doctor> findDoctor(int id) {
        return findById(id).filter(u -> u instanceof Doctor).map(u -> (Doctor) u);
    }

    public Optional<User> findByEmail(String email) {
        return query("SELECT " + COLS + " FROM users WHERE email=?", this::map, email.toLowerCase()).stream().findFirst();
    }

    /** Returns the user if email + password match, otherwise null. */
    public User authenticate(String email, String password) {
        var rows = query("SELECT id, password_hash FROM users WHERE email=?",
            rs -> new Object[]{rs.getInt(1), rs.getString(2)}, email.toLowerCase());
        if (rows.isEmpty() || !PasswordUtil.verify(password, (String) rows.get(0)[1])) return null;
        return findById((Integer) rows.get(0)[0]).orElse(null);
    }

    public boolean emailTaken(String email, int exceptId) {
        return count("SELECT COUNT(*) FROM users WHERE email=? AND id<>?", email.toLowerCase(), exceptId) > 0;
    }

    public User create(String name, String email, String password, String role, String specialization) {
        int id = insert("INSERT INTO users (name,email,password_hash,role,specialization) VALUES (?,?,?,?,?)",
            name, email.toLowerCase(), PasswordUtil.hash(password), role, specialization);
        return findById(id).orElseThrow();
    }

    public boolean adminUpdate(int id, String name, String email, String role) {
        return update("UPDATE users SET name=?, email=?, role=? WHERE id=?", name, email.toLowerCase(), role, id) > 0;
    }

    public void updateProfile(int id, String name, String email, String phone, String newPassword) {
        update("UPDATE users SET name=?, email=?, phone=? WHERE id=?", name, email.toLowerCase(), phone, id);
        if (newPassword != null && !newPassword.isBlank())
            update("UPDATE users SET password_hash=? WHERE id=?", PasswordUtil.hash(newPassword), id);
    }

    public void updateSchedule(int id, List<Integer> days, String start, String end) {
        StringJoiner j = new StringJoiner(",");
        days.forEach(d -> j.add(String.valueOf(d)));
        update("UPDATE users SET work_days=?, start_time=?, end_time=? WHERE id=? AND role='doctor'",
            j.toString(), start + ":00", end + ":00", id);
    }

    @Override public boolean delete(int id) { return update("DELETE FROM users WHERE id=?", id) > 0; }
}
