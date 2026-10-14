package com.aurahealth.dao;

import com.aurahealth.util.PasswordUtil;

public class AdminDAO extends BaseDao {
    public void ensureDefault(String id, String password) {
        if (count("SELECT COUNT(*) FROM admin WHERE id=?", id) == 0)
            update("INSERT INTO admin (id, password_hash) VALUES (?,?)", id, PasswordUtil.hash(password));
    }
    public boolean verify(String id, String password) {
        var hashes = query("SELECT password_hash FROM admin WHERE id=?", rs -> rs.getString(1), id);
        return !hashes.isEmpty() && PasswordUtil.verify(password, hashes.get(0));
    }
}
