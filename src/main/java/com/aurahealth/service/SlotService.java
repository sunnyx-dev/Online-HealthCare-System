package com.aurahealth.service;

import com.aurahealth.dao.AppointmentDAO;
import com.aurahealth.dao.SettingsDAO;
import com.aurahealth.model.Doctor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/** Core logic: turns a doctor's working hours into free appointment slots. */
public class SlotService {
    public record DaySlots(String date, List<String> times) {}

    private final AppointmentDAO appts = new AppointmentDAO();
    private final SettingsDAO settings = new SettingsDAO();

    private static int minutes(String hhmm) { LocalTime t = LocalTime.parse(hhmm); return t.getHour() * 60 + t.getMinute(); }
    private static String fmt(int m) { return String.format("%02d:%02d", m / 60, m % 60); }

    public List<String> freeSlots(Doctor d, String date) {
        LocalDate day = LocalDate.parse(date);
        if (day.isBefore(LocalDate.now())) return List.of();
        int dow = day.getDayOfWeek().getValue() % 7;                // Sunday = 0
        if (!d.getWorkDays().contains(dow)) return List.of();
        int step = settings.slotMinutes(), end = minutes(d.getEndTime());
        int nowMin = day.equals(LocalDate.now()) ? LocalTime.now().getHour() * 60 + LocalTime.now().getMinute() : -1;
        Set<String> booked = appts.bookedTimes(d.getId(), date);
        List<String> out = new ArrayList<>();
        for (int m = minutes(d.getStartTime()); m + step <= end; m += step)
            if (m > nowMin && !booked.contains(fmt(m))) out.add(fmt(m));
        return out;
    }

    public List<DaySlots> nextFree(Doctor d, int days) {
        List<DaySlots> out = new ArrayList<>();
        LocalDate day = LocalDate.now();
        for (int i = 0; i < 14 && out.size() < days; i++, day = day.plusDays(1)) {
            List<String> s = freeSlots(d, day.toString());
            if (!s.isEmpty()) out.add(new DaySlots(day.toString(), s.subList(0, Math.min(4, s.size()))));
        }
        return out;
    }
}
