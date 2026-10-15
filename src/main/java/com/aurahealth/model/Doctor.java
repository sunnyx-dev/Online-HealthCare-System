package com.aurahealth.model;

import java.util.List;

/**
 * Doctor Domain Entity (Extends {@link User}).
 * <p>
 * Illustrates <b>Inheritance</b> and <b>Polymorphism</b> in the Core Java architecture.
 * Inherits identity attributes (id, name, email, phone) from {@link User} while adding
 * medical practitioner-specific fields:
 * <ul>
 *   <li>{@code specialization}: Medical specialty (e.g., Cardiology, Dermatology, Orthopedics).</li>
 *   <li>{@code workDays}: Days of the week available for OPD consultations (0=Sun ... 6=Sat).</li>
 *   <li>{@code startTime}: Clinical shift start time (HH:mm).</li>
 *   <li>{@code endTime}: Clinical shift end time (HH:mm).</li>
 *   <li>{@code rating}: Average star rating computed from verified patient reviews.</li>
 * </ul>
 * </p>
 */
public class Doctor extends User {

    private String specialization;
    private String startTime;
    private String endTime;
    private List<Integer> workDays;
    private Double rating;

    /**
     * Constructs a Doctor entity.
     *
     * @param id primary key identifier
     * @param name doctor full name with title
     * @param email professional contact email
     * @param phone mobile contact number
     * @param specialization clinical medical specialty
     * @param workDays list of working days of the week (0=Sunday ... 6=Saturday)
     * @param startTime daily shift start time (HH:mm)
     * @param endTime daily shift end time (HH:mm)
     */
    public Doctor(int id, String name, String email, String phone, String specialization,
                  List<Integer> workDays, String startTime, String endTime) {
        super(id, name, email, "doctor", phone);
        this.specialization = specialization;
        this.workDays = workDays;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public List<Integer> getWorkDays() {
        return workDays;
    }

    public void setWorkDays(List<Integer> workDays) {
        this.workDays = workDays;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}

