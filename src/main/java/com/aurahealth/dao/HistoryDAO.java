package com.aurahealth.dao;

import com.aurahealth.model.HistoryRecord;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class HistoryDAO extends BaseDao {
    private static final String SEL =
        "SELECT h.id,h.patient_id,h.doctor_id,p.name pn,d.name dn,h.record_date,h.details FROM medical_history h " +
        "JOIN users p ON p.id=h.patient_id LEFT JOIN users d ON d.id=h.doctor_id ";

    private HistoryRecord map(ResultSet rs) throws SQLException {
        HistoryRecord h = new HistoryRecord();
        h.id = rs.getInt("id"); h.patientId = rs.getInt("patient_id");
        int d = rs.getInt("doctor_id"); h.doctorId = rs.wasNull() ? null : d;
        h.patientName = rs.getString("pn"); h.doctorName = rs.getString("dn");
        h.date = rs.getString("record_date"); h.details = rs.getString("details");
        return h;
    }
    public List<HistoryRecord> byPatient(int pid) {
        return query(SEL + "WHERE h.patient_id=? ORDER BY h.record_date DESC, h.id DESC", this::map, pid);
    }
    /** Records of every patient who has had an appointment with this doctor. */
    public List<HistoryRecord> forDoctor(int did) {
        return query(SEL + "WHERE h.patient_id IN (SELECT patient_id FROM appointments WHERE doctor_id=?) " +
            "ORDER BY h.record_date DESC, h.id DESC", this::map, did);
    }
    public void add(int patientId, Integer doctorId, String details) {
        insert("INSERT INTO medical_history (patient_id,doctor_id,record_date,details) VALUES (?,?,CURDATE(),?)",
            patientId, doctorId, details);
    }
}
