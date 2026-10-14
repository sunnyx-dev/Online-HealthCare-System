package com.aurahealth.model;

import java.util.List;

public class Doctor extends User {
    private String specialization, startTime, endTime;
    private List<Integer> workDays;   // 0 = Sunday ... 6 = Saturday
    private Double rating;            // filled in by the servlet

    public Doctor(int id, String name, String email, String phone, String specialization,
                  List<Integer> workDays, String startTime, String endTime) {
        super(id, name, email, "doctor", phone);
        this.specialization = specialization; this.workDays = workDays;
        this.startTime = startTime; this.endTime = endTime;
    }
    public String getSpecialization() { return specialization; }
    public List<Integer> getWorkDays() { return workDays; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public void setRating(Double r) { this.rating = r; }
}
