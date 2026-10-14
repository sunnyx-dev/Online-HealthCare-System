package com.aurahealth.dao;

import java.util.*;

public class SettingsDAO extends BaseDao {
    public Map<String, String> all() {
        Map<String, String> m = new LinkedHashMap<>();
        query("SELECT k, v FROM settings", rs -> m.put(rs.getString(1), rs.getString(2)));
        return m;
    }
    public void put(String k, String v) {
        update("INSERT INTO settings (k,v) VALUES (?,?) ON DUPLICATE KEY UPDATE v=VALUES(v)", k, v);
    }
    public int slotMinutes() {
        try { return Integer.parseInt(all().getOrDefault("slot_minutes", "30")); } catch (NumberFormatException e) { return 30; }
    }
    public boolean bookingEnabled() { return Boolean.parseBoolean(all().getOrDefault("booking_enabled", "true")); }
}
