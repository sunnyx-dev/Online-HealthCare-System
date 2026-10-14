package com.aurahealth.model;

public class HistoryRecord {
    public int id, patientId;
    public Integer doctorId;               // null when the patient wrote it themselves
    public String patientName, doctorName, date, details;
}
