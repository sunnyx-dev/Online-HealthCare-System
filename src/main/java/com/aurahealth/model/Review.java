package com.aurahealth.model;

/**
 * Review & Rating Domain Entity.
 * <p>
 * Encapsulates verified patient feedback, star rating (1 to 5),
 * and written doctor evaluation comments following a completed appointment.
 * </p>
 */
public class Review {

    /** Unique primary key identifier. */
    public int id;

    /** Foreign key reference to the corresponding completed {@link Appointment}. */
    public int appointmentId;

    /** Foreign key reference to reviewed {@link Doctor}. */
    public int doctorId;

    /** Foreign key reference to reviewing patient {@link User}. */
    public int patientId;

    /** Star rating numerical score between 1 and 5. */
    public int stars;

    /** Reviewing patient's display name populated via SQL JOIN. */
    public String patientName;

    /** Written feedback commentary. */
    public String comment;

    /**
     * Default no-arg constructor for DAO mapping and JSON deserialization.
     */
    public Review() {}

    /**
     * Parameterized constructor for review creation.
     */
    public Review(int id, int appointmentId, int doctorId, int patientId,
                  int stars, String patientName, String comment) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.stars = stars;
        this.patientName = patientName;
        this.comment = comment;
    }
}

