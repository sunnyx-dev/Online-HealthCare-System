package com.aurahealth.dao;

import java.util.*;

public class StatsDAO extends BaseDao {
    public Map<String, Object> summary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("patients", count("SELECT COUNT(*) FROM users WHERE role='patient'"));
        m.put("doctors", count("SELECT COUNT(*) FROM users WHERE role='doctor'"));
        m.put("appointments", count("SELECT COUNT(*) FROM appointments"));
        Map<String, Long> byStatus = new LinkedHashMap<>();
        query("SELECT status, COUNT(*) FROM appointments GROUP BY status", rs -> byStatus.put(rs.getString(1), rs.getLong(2)));
        m.put("byStatus", byStatus);
        Map<String, Long> perDoctor = new LinkedHashMap<>();
        query("SELECT u.name, COUNT(a.id) FROM users u LEFT JOIN appointments a ON a.doctor_id=u.id " +
              "WHERE u.role='doctor' GROUP BY u.id, u.name ORDER BY u.name", rs -> perDoctor.put(rs.getString(1), rs.getLong(2)));
        m.put("perDoctor", perDoctor);
        return m;
    }
}
