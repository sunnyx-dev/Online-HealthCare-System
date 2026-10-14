package com.aurahealth.dao;

import com.aurahealth.model.Review;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class ReviewDAO extends BaseDao {
    private Review map(ResultSet rs) throws SQLException {
        Review r = new Review();
        r.id = rs.getInt("id"); r.appointmentId = rs.getInt("appointment_id"); r.doctorId = rs.getInt("doctor_id");
        r.patientId = rs.getInt("patient_id"); r.stars = rs.getInt("stars"); r.comment = rs.getString("comment");
        r.patientName = rs.getString("name");
        return r;
    }
    public List<Review> byDoctor(int did) {
        return query("SELECT r.*, u.name FROM reviews r JOIN users u ON u.id=r.patient_id WHERE r.doctor_id=? ORDER BY r.id DESC",
            this::map, did);
    }
    public boolean exists(int appointmentId) {
        return count("SELECT COUNT(*) FROM reviews WHERE appointment_id=?", appointmentId) > 0;
    }
    public void add(int appointmentId, int doctorId, int patientId, int stars, String comment) {
        insert("INSERT INTO reviews (appointment_id,doctor_id,patient_id,stars,comment) VALUES (?,?,?,?,?)",
            appointmentId, doctorId, patientId, stars, comment);
    }
    public Map<Integer, Double> averages() {
        Map<Integer, Double> m = new HashMap<>();
        query("SELECT doctor_id, AVG(stars) FROM reviews GROUP BY doctor_id",
            rs -> m.put(rs.getInt(1), Math.round(rs.getDouble(2) * 10) / 10.0));
        return m;
    }
}
