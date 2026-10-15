package com.aurahealth.model;

/**
 * Medical History Record Domain Entity.
 * <p>
 * Represents a documented clinical diagnosis, prescription, or health summary entry
 * within a patient's Electronic Health Record (EHR).
 * </p>
 */
public class HistoryRecord {

    /** Unique primary key identifier. */
    public int id;

    /** Foreign key reference to patient {@link User}. */
    public int patientId;

    /**
     * Foreign key reference to attending {@link Doctor}.
     * Nullable when the health record is entered directly by the patient.
     */
    public Integer doctorId;

    /** Patient's display name populated via relational SQL JOIN. */
    public String patientName;

    /** Attending doctor's display name (or null if self-recorded). */
    public String doctorName;

    /** Recording date string (YYYY-MM-DD). */
    public String date;

    /** Clinical prescription, symptom history, or diagnosis text. */
    public String details;

    /**
     * Default no-arg constructor for DAO mapping and JSON deserialization.
     */
    public HistoryRecord() {}

    /**
     * Parameterized constructor for medical record creation.
     */
    public HistoryRecord(int id, int patientId, Integer doctorId, String patientName,
                         String doctorName, String date, String details) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.date = date;
        this.details = details;
    }
}

