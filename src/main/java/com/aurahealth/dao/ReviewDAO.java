package com.aurahealth.dao;

import com.aurahealth.model.Review;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Data Access Object for Doctor Patient Feedback & Star Ratings.
 * <p>
 * Supports submission of verified post-consultation reviews, 1-to-5 star ratings,
 * and computation of aggregate doctor performance metrics.
 * </p>
 */
public class ReviewDAO extends BaseDao {

    /**
     * Maps a review database record to a {@link Review} domain entity.
     *
     * @param rs active ResultSet
     * @return populated Review instance
     * @throws SQLException if column reading fails
     */
    private Review map(ResultSet rs) throws SQLException {
        Review r = new Review();
        r.id = rs.getInt("id");
        r.appointmentId = rs.getInt("appointment_id");
        r.doctorId = rs.getInt("doctor_id");
        r.patientId = rs.getInt("patient_id");
        r.stars = rs.getInt("stars");
        r.comment = rs.getString("comment");
        r.patientName = rs.getString("name");
        return r;
    }

    /**
     * Retrieves all published patient reviews for a specific doctor.
     *
     * @param did doctor user ID
     * @return list of reviews (newest first)
     */
    public List<Review> byDoctor(int did) {
        return query(
            "SELECT r.*, u.name FROM reviews r JOIN users u ON u.id = r.patient_id WHERE r.doctor_id=? ORDER BY r.id DESC",
            this::map,
            did
        );
    }

    /**
     * Checks if a review has already been submitted for a particular appointment ID.
     * Guarantees at most one review per completed appointment.
     *
     * @param appointmentId appointment ID
     * @return true if review exists; false otherwise
     */
    public boolean exists(int appointmentId) {
        return count("SELECT COUNT(*) FROM reviews WHERE appointment_id=?", appointmentId) > 0;
    }

    /**
     * Submits a new patient rating and review.
     *
     * @param appointmentId appointment ID
     * @param doctorId doctor user ID
     * @param patientId patient user ID
     * @param stars rating from 1 to 5
     * @param comment feedback commentary
     */
    public void add(int appointmentId, int doctorId, int patientId, int stars, String comment) {
        insert(
            "INSERT INTO reviews (appointment_id, doctor_id, patient_id, stars, comment) VALUES (?, ?, ?, ?, ?)",
            appointmentId, doctorId, patientId, stars, comment
        );
    }

    /**
     * Calculates the average star rating for each doctor across all reviews, rounded to one decimal place.
     *
     * @return map of doctorId to average rating score (e.g. 4.8)
     */
    public Map<Integer, Double> averages() {
        Map<Integer, Double> m = new HashMap<>();
        query(
            "SELECT doctor_id, AVG(stars) FROM reviews GROUP BY doctor_id",
            rs -> m.put(rs.getInt(1), Math.round(rs.getDouble(2) * 10) / 10.0)
        );
        return m;
    }
}

