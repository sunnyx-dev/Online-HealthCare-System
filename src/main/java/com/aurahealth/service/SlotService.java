package com.aurahealth.service;

import com.aurahealth.dao.AppointmentDAO;
import com.aurahealth.dao.SettingsDAO;
import com.aurahealth.model.Doctor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * Service Layer for Doctor Appointment Slot Generation & Scheduling Logic.
 * <p>
 * Implements clinical schedule partitioning:
 * <ul>
 *   <li>Calculates available appointment time slots by dividing doctor working hours
 *       into uniform intervals (defined by clinic {@code slot_minutes} configuration).</li>
 *   <li>Enforces business constraints: ignores past dates, respects doctor weekly off-days,
 *       skips times already elapsed if the date is today, and filters out already-booked slots.</li>
 * </ul>
 * </p>
 */
public class SlotService {

    /**
     * Immutable DTO representing a schedule preview for a specific calendar date.
     *
     * @param date the ISO date string (YYYY-MM-DD)
     * @param times list of available starting times (HH:mm)
     */
    public record DaySlots(String date, List<String> times) {}

    private final AppointmentDAO appts;
    private final SettingsDAO settings;

    /**
     * Constructs a new SlotService with default DAO dependencies.
     */
    public SlotService() {
        this.appts = new AppointmentDAO();
        this.settings = new SettingsDAO();
    }

    /**
     * Converts a 24-hour time string ("HH:mm") into total minutes from midnight.
     *
     * @param hhmm formatted time string
     * @return minutes from midnight (0 to 1439)
     */
    private static int minutes(String hhmm) {
        LocalTime t = LocalTime.parse(hhmm);
        return t.getHour() * 60 + t.getMinute();
    }

    /**
     * Formats total minutes from midnight back into standard "HH:mm" notation.
     *
     * @param m minutes from midnight
     * @return 5-character string (e.g., "09:30")
     */
    private static String fmt(int m) {
        return String.format("%02d:%02d", m / 60, m % 60);
    }

    /**
     * Computes all available, non-conflicting appointment slots for a doctor on a specific date.
     *
     * @param d the doctor whose schedule is being calculated
     * @param date the target date in ISO format (YYYY-MM-DD)
     * @return list of free slot times in "HH:mm" format; empty list if doctor is not working or fully booked
     */
    public List<String> freeSlots(Doctor d, String date) {
        LocalDate day = LocalDate.parse(date);

        // Disallow booking appointments in the past
        if (day.isBefore(LocalDate.now())) {
            return List.of();
        }

        // Check doctor weekly schedule (0 = Sunday, 1 = Monday ... 6 = Saturday)
        int dow = day.getDayOfWeek().getValue() % 7;
        if (!d.getWorkDays().contains(dow)) {
            return List.of();
        }

        int step = settings.slotMinutes();
        int end = minutes(d.getEndTime());

        // For today's date, suppress slots that have already passed in real-time
        int nowMin = day.equals(LocalDate.now())
            ? LocalTime.now().getHour() * 60 + LocalTime.now().getMinute()
            : -1;

        // Fetch already reserved slots from database
        Set<String> booked = appts.bookedTimes(d.getId(), date);
        List<String> out = new ArrayList<>();

        for (int m = minutes(d.getStartTime()); m + step <= end; m += step) {
            String timeStr = fmt(m);
            if (m > nowMin && !booked.contains(timeStr)) {
                out.add(timeStr);
            }
        }
        return out;
    }

    /**
     * Generates a preview of upcoming available slots across the next few days.
     *
     * @param d doctor domain entity
     * @param days number of working days with open slots to find
     * @return list of {@link DaySlots} containing up to 4 open slots per day
     */
    public List<DaySlots> nextFree(Doctor d, int days) {
        List<DaySlots> out = new ArrayList<>();
        LocalDate day = LocalDate.now();

        for (int i = 0; i < 14 && out.size() < days; i++, day = day.plusDays(1)) {
            List<String> s = freeSlots(d, day.toString());
            if (!s.isEmpty()) {
                out.add(new DaySlots(day.toString(), s.subList(0, Math.min(4, s.size()))));
            }
        }
        return out;
    }
}

