package com.aurahealth.model;

/**
 * Appointment Domain Entity.
 * <p>
 * Represents a scheduled consultation between a patient and a medical doctor.
 * Encapsulates the appointment lifecycle status ('Pending', 'Confirmed', 'Completed', 'Cancelled').
 * </p>
 */
public class Appointment {

    /** Unique primary key identifier. */
    public int id;

    /** Foreign key reference to {@link User} (role: patient). */
    public int patientId;

    /** Foreign key reference to {@link Doctor} (role: doctor). */
    public int doctorId;

    /** Patient's display name populated via relational SQL JOIN. */
    public String patientName;

    /** Attending doctor's display name populated via relational SQL JOIN. */
    public String doctorName;

    /** Scheduled date string in ISO format (YYYY-MM-DD). */
    public String date;

    /** Scheduled slot time in 24-hour format (HH:mm). */
    public String time;

    /** Lifecycle state ('Pending', 'Confirmed', 'Completed', 'Cancelled'). */
    public String status;

    /** Optional medical notes, symptoms, or administrative remarks. */
    public String notes;

    /**
     * Default no-arg constructor for DAO mapping and JSON deserialization.
     */
    public Appointment() {}

    /**
     * Parameterized constructor for appointment creation.
     */
    public Appointment(int id, int patientId, int doctorId, String patientName, String doctorName,
                       String date, String time, String status, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.date = date;
        this.time = time;
        this.status = status;
        this.notes = notes;
    }
}

