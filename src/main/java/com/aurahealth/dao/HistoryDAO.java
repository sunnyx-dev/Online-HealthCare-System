package com.aurahealth.dao;

import com.aurahealth.model.HistoryRecord;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object for Patient Medical History & Clinical Records.
 * <p>
 * Handles electronic health record (EHR) entries, past diagnoses, treatment notes,
 * and confidential consultation summaries.
 * </p>
 */
public class HistoryDAO extends BaseDao {

    /** Query projection joining medical history with patient and doctor profiles. */
    private static final String SEL =
        "SELECT h.id, h.patient_id, h.doctor_id, p.name AS pn, d.name AS dn, h.record_date, h.details " +
        "FROM medical_history h " +
        "JOIN users p ON p.id = h.patient_id " +
        "LEFT JOIN users d ON d.id = h.doctor_id ";

    /**
     * Maps a result set row into a {@link HistoryRecord} entity.
     *
     * @param rs active ResultSet pointing to a medical record
     * @return populated HistoryRecord
     * @throws SQLException if a column cannot be read
     */
    private HistoryRecord map(ResultSet rs) throws SQLException {
        HistoryRecord h = new HistoryRecord();
        h.id = rs.getInt("id");
        h.patientId = rs.getInt("patient_id");
        int d = rs.getInt("doctor_id");
        h.doctorId = rs.wasNull() ? null : d;
        h.patientName = rs.getString("pn");
        h.doctorName = rs.getString("dn");
        h.date = rs.getString("record_date");
        h.details = rs.getString("details");
        return h;
    }

    /**
     * Retrieves chronological medical history records for a specific patient.
     *
     * @param pid patient user ID
     * @return list of medical history records (newest first)
     */
    public List<HistoryRecord> byPatient(int pid) {
        return query(SEL + "WHERE h.patient_id=? ORDER BY h.record_date DESC, h.id DESC", this::map, pid);
    }

    /**
     * Retrieves medical records of every patient who has had an appointment with the specified doctor.
     *
     * @param did doctor user ID
     * @return list of medical history records (newest first)
     */
    public List<HistoryRecord> forDoctor(int did) {
        return query(
            SEL + "WHERE h.patient_id IN (SELECT patient_id FROM appointments WHERE doctor_id=?) " +
            "ORDER BY h.record_date DESC, h.id DESC",
            this::map,
            did
        );
    }

    /**
     * Appends a new medical record / diagnosis note for a patient.
     *
     * @param patientId patient user ID
     * @param doctorId attending doctor ID (or null for self-reported entries)
     * @param details clinical notes, prescriptions, diagnosis text
     */
    public void add(int patientId, Integer doctorId, String details) {
        insert(
            "INSERT INTO medical_history (patient_id, doctor_id, record_date, details) VALUES (?, ?, CURDATE(), ?)",
            patientId, doctorId, details
        );
    }
}

