package com.aurahealth.model;

/** Base account type. Patients are plain Users; doctors extend it (inheritance). */
public class User {
    private int id;
    private String name, email, role, phone;

    public User(int id, String name, String email, String role, String phone) {
        this.id = id; this.name = name; this.email = email; this.role = role; this.phone = phone;
    }
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getPhone() { return phone; }
}
