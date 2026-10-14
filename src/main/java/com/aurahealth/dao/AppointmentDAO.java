package com.aurahealth.dao;

import com.aurahealth.model.Appointment;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalTime;
import java.util.*;

public class AppointmentDAO extends BaseDao implements Dao<Appointment> {
    private static final String SEL = "SELECT a.id,a.patient_id,a.doctor_id,p.name pn,d.name dn,a.appt_date,a.appt_time,a.status,a.notes "
            +
            "FROM appointments a JOIN users p ON p.id=a.patient_id JOIN users d ON d.id=a.doctor_id ";

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

    private List<Appointment> list(String where, Object... args) {
        return query(SEL + where + " ORDER BY a.appt_date, a.appt_time", this::map, args);
    }

    @Override
    public List<Appointment> findAll() {
        return list("");
    }

    @Override
    public Optional<Appointment> findById(int id) {
        return list("WHERE a.id=?", id).stream().findFirst();
    }

    public List<Appointment> byPatient(int id) {
        return list("WHERE a.patient_id=?", id);
    }

    public List<Appointment> byDoctor(int id) {
        return list("WHERE a.doctor_id=?", id);
    }

    @Override
    public boolean delete(int id) {
        return update("DELETE FROM appointments WHERE id=?", id) > 0;
    }

    public Set<String> bookedTimes(int doctorId, String date) {
        return new HashSet<>(query(
                "SELECT appt_time FROM appointments WHERE doctor_id=? AND appt_date=? AND status<>'Cancelled'",
                rs -> rs.getString(1).substring(0, 5), doctorId, java.sql.Date.valueOf(date)));
    }

    private boolean taken(int doctorId, String date, String time, int exceptId) {
        return count("SELECT COUNT(*) FROM appointments WHERE doctor_id=? AND appt_date=? AND appt_time=? " +
                "AND status<>'Cancelled' AND id<>?", doctorId, java.sql.Date.valueOf(date),
                java.sql.Time.valueOf(LocalTime.parse(time)), exceptId) > 0;
    }

    /**
     * synchronized so two patients cannot grab the same slot at once. Returns empty
     * if the slot is taken.
     */
    public synchronized Optional<Appointment> book(int patientId, int doctorId, String date, String time) {
        if (taken(doctorId, date, time, 0))
            return Optional.empty();
        int id = insert("INSERT INTO appointments (patient_id,doctor_id,appt_date,appt_time) VALUES (?,?,?,?)",
                patientId, doctorId, java.sql.Date.valueOf(date), java.sql.Time.valueOf(LocalTime.parse(time)));
        return findById(id);
    }

    public synchronized boolean reschedule(Appointment a, String date, String time) {
        if (taken(a.doctorId, date, time, a.id))
            return false;
        update("UPDATE appointments SET appt_date=?, appt_time=? WHERE id=?",
                java.sql.Date.valueOf(date), java.sql.Time.valueOf(LocalTime.parse(time)), a.id);
        return true;
    }

    public void setStatus(int id, String status) {
        update("UPDATE appointments SET status=? WHERE id=?", status, id);
    }

    public boolean hasRelation(int doctorId, int patientId) {
        return count("SELECT COUNT(*) FROM appointments WHERE doctor_id=? AND patient_id=?", doctorId, patientId) > 0;
    }
}
