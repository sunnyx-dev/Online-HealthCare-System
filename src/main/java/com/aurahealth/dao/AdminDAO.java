package com.aurahealth.dao;

import com.aurahealth.util.PasswordUtil;

/**
 * Data Access Object for Administrator Security & Credentials.
 * <p>
 * Manages administrator login verification and seed initialization.
 * </p>
 */
public class AdminDAO extends BaseDao {

    /**
     * Ensures that the default system administrator account exists in the database.
     * If absent, hashes the initial default password with PBKDF2 and creates the record.
     *
     * @param id administrator username/ID (e.g., 'Sunny123')
     * @param password plain text initial password
     */
    public void ensureDefault(String id, String password) {
        if (count("SELECT COUNT(*) FROM admin WHERE id=?", id) == 0) {
            update("INSERT INTO admin (id, password_hash) VALUES (?, ?)", id, PasswordUtil.hash(password));
        }
    }

    /**
     * Verifies administrator credentials against stored PBKDF2 salted hashes.
     *
     * @param id administrator username/ID
     * @param password raw plain text password input
     * @return true if credentials match; false otherwise
     */
    public boolean verify(String id, String password) {
        var hashes = query("SELECT password_hash FROM admin WHERE id=?", rs -> rs.getString(1), id);
        return !hashes.isEmpty() && PasswordUtil.verify(password, hashes.get(0));
    }
}

