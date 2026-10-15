package com.aurahealth.dao;

import java.util.*;

/**
 * Data Access Object for Global Clinic Settings.
 * <p>
 * Manages key-value system configurations such as clinic branding,
 * slot appointment duration (e.g. 15, 30, 45 minutes), and booking feature toggles.
 * </p>
 */
public class SettingsDAO extends BaseDao {

    /**
     * Retrieves all system settings as a key-value map.
     *
     * @return map of setting keys to setting string values
     */
    public Map<String, String> all() {
        Map<String, String> m = new LinkedHashMap<>();
        query("SELECT k, v FROM settings", rs -> m.put(rs.getString(1), rs.getString(2)));
        return m;
    }

    /**
     * Updates or inserts a configuration setting key and value (UPSERT).
     *
     * @param k setting key
     * @param v setting value
     */
    public void put(String k, String v) {
        update("INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v=VALUES(v)", k, v);
    }

    /**
     * Retrieves the appointment slot duration in minutes (default: 30 minutes).
     *
     * @return slot duration in minutes
     */
    public int slotMinutes() {
        try {
            return Integer.parseInt(all().getOrDefault("slot_minutes", "30"));
        } catch (NumberFormatException e) {
            return 30;
        }
    }

    /**
     * Checks whether online patient self-booking is enabled by the administrator.
     *
     * @return true if booking is open; false if suspended
     */
    public boolean bookingEnabled() {
        return Boolean.parseBoolean(all().getOrDefault("booking_enabled", "true"));
    }
}

