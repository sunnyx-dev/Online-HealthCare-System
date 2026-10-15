package com.aurahealth.dao;

import com.aurahealth.model.Appointment;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalTime;
import java.util.*;

/**
 * Data Access Object for Appointment Management.
 * <p>
 * Implements scheduling, slot validation, booking with synchronized race-condition guards,
 * status transitions, and doctor-patient relationship queries.
 * </p>
 */
public class AppointmentDAO extends BaseDao implements Dao<Appointment> {

    /** Base projection joining appointment records with patient and doctor user accounts. */
    private static final String SEL =
        "SELECT a.id, a.patient_id, a.doctor_id, p.name AS pn, d.name AS dn, a.appt_date, a.appt_time, a.status, a.notes " +
        "FROM appointments a " +
        "JOIN users p ON p.id = a.patient_id " +
        "JOIN users d ON d.id = a.doctor_id ";

    /**
     * Maps an appointment row from a {@link ResultSet} to an {@link Appointment} domain model instance.
     *
     * @param rs current row
     * @return populated Appointment instance
     * @throws SQLException if a column cannot be read
     */
    private Appointment map(ResultSet rs) throws SQLException {
        Appointment a = new Appointment();
        a.id = rs.getInt("id");
        a.patientId = rs.getInt("patient_id");
        a.doctorId = rs.getInt("doctor_id");
        a.patientName = rs.getString("pn");
        a.doctorName = rs.getString("dn");
        a.date = rs.getString("appt_date");
        a.time = rs.getString("appt_time").substring(0, 5);
        a.status = rs.getString("status");
        a.notes = rs.getString("notes");
        return a;
    }

    /**
     * Helper to query appointments with custom WHERE filter and chronological ordering.
     *
     * @param where SQL WHERE clause (or empty string)
     * @param args positional query arguments
     * @return ordered list of appointments
     */
    private List<Appointment> list(String where, Object... args) {
        return query(SEL + where + " ORDER BY a.appt_date, a.appt_time", this::map, args);
    }

    /**
     * Retrieves all appointments across the entire clinic system (Admin access).
     *
     * @return list of all appointments
     */
    @Override
    public List<Appointment> findAll() {
        return list("");
    }

    /**
     * Finds an appointment by its primary key ID.
     *
     * @param id appointment ID
     * @return Optional containing the appointment if found
     */
    @Override
    public Optional<Appointment> findById(int id) {
        return list("WHERE a.id=?", id).stream().findFirst();
    }

    /**
     * Retrieves all appointments booked by a specific patient.
     *
     * @param patientId patient user ID
     * @return list of patient appointments
     */
    public List<Appointment> byPatient(int patientId) {
        return list("WHERE a.patient_id=?", patientId);
    }

    /**
     * Retrieves all appointments assigned to a specific doctor.
     *
     * @param doctorId doctor user ID
     * @return list of doctor appointments
     */
    public List<Appointment> byDoctor(int doctorId) {
        return list("WHERE a.doctor_id=?", doctorId);
    }

    /**
     * Deletes an appointment by ID.
     *
     * @param id appointment ID
     * @return true if deleted
     */
    @Override
    public boolean delete(int id) {
        return update("DELETE FROM appointments WHERE id=?", id) > 0;
    }

    /**
     * Retrieves the set of booked time strings (HH:mm) for a doctor on a given date,
     * excluding cancelled appointments.
     *
     * @param doctorId doctor user ID
     * @param date ISO date string (YYYY-MM-DD)
     * @return set of booked time slots in HH:mm format
     */
    public Set<String> bookedTimes(int doctorId, String date) {
        return new HashSet<>(query(
            "SELECT appt_time FROM appointments WHERE doctor_id=? AND appt_date=? AND status<>'Cancelled'",
            rs -> rs.getString(1).substring(0, 5),
            doctorId,
            java.sql.Date.valueOf(date)
        ));
    }

    /**
     * Checks if a doctor slot is already occupied by an active appointment.
     *
     * @param doctorId doctor ID
     * @param date appointment date string
     * @param time appointment time string (HH:mm)
     * @param exceptId appointment ID to ignore (used during rescheduling)
     * @return true if slot is taken; false if free
     */
    private boolean taken(int doctorId, String date, String time, int exceptId) {
        return count(
            "SELECT COUNT(*) FROM appointments WHERE doctor_id=? AND appt_date=? AND appt_time=? " +
            "AND status<>'Cancelled' AND id<>?",
            doctorId,
            java.sql.Date.valueOf(date),
            java.sql.Time.valueOf(LocalTime.parse(time)),
            exceptId
        ) > 0;
    }

    /**
     * Books an appointment slot atomically.
     * <p>
     * Method is {@code synchronized} at the DAO monitor level to prevent race conditions
     * and double-booking when multiple patients attempt to reserve the same doctor slot concurrently.
     * </p>
     *
     * @param patientId patient user ID
     * @param doctorId doctor user ID
     * @param date booking date (YYYY-MM-DD)
     * @param time booking slot time (HH:mm)
     * @return Optional containing the newly created Appointment, or empty if slot was already taken
     */
    public synchronized Optional<Appointment> book(int patientId, int doctorId, String date, String time) {
        if (taken(doctorId, date, time, 0)) {
            return Optional.empty();
        }
        int id = insert(
            "INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time) VALUES (?, ?, ?, ?)",
            patientId,
            doctorId,
            java.sql.Date.valueOf(date),
            java.sql.Time.valueOf(LocalTime.parse(time))
        );
        return findById(id);
    }

    /**
     * Reschedules an existing appointment to a new date and time.
     *
     * @param a the existing Appointment record
     * @param date new date (YYYY-MM-DD)
     * @param time new time (HH:mm)
     * @return true if rescheduled successfully; false if target slot was taken
     */
    public synchronized boolean reschedule(Appointment a, String date, String time) {
        if (taken(a.doctorId, date, time, a.id)) {
            return false;
        }
        update(
            "UPDATE appointments SET appt_date=?, appt_time=? WHERE id=?",
            java.sql.Date.valueOf(date),
            java.sql.Time.valueOf(LocalTime.parse(time)),
            a.id
        );
        return true;
    }

    /**
     * Updates an appointment status ('Pending', 'Confirmed', 'Completed', 'Cancelled').
     *
     * @param id appointment ID
     * @param status new status string
     */
    public void setStatus(int id, String status) {
        update("UPDATE appointments SET status=? WHERE id=?", status, id);
    }

    /**
     * Checks if a doctor has an active clinical history/appointment relationship with a patient.
     * Used for authorization before accessing confidential medical records.
     *
     * @param doctorId doctor user ID
     * @param patientId patient user ID
     * @return true if relationship exists; false otherwise
     */
    public boolean hasRelation(int doctorId, int patientId) {
        return count("SELECT COUNT(*) FROM appointments WHERE doctor_id=? AND patient_id=?", doctorId, patientId) > 0;
    }
}

