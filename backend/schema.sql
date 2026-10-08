-- ==========================================================
-- AuraHealth Enterprise PostgreSQL & Supabase Database Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Patients, Doctors, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    phone VARCHAR(50),
    blood_group VARCHAR(10),
    age INT,
    gender VARCHAR(20),
    allergies TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Doctors Table (Linked to users table)
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(150),
    experience_years INT DEFAULT 5,
    consultation_fee NUMERIC(10, 2) DEFAULT 500.00,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    timings VARCHAR(100) DEFAULT '09:00 AM - 02:00 PM',
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    room_number VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    symptoms TEXT,
    consultation_notes TEXT,
    prescription TEXT,
    fee NUMERIC(10, 2) DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Electronic Medical Records (EMR)
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    record_date DATE DEFAULT CURRENT_DATE,
    diagnosis TEXT NOT NULL,
    vitals JSONB DEFAULT '{"bp": "120/80 mmHg", "pulse": "72 bpm", "temp": "98.6 F"}'::jsonb,
    prescription TEXT,
    lab_report_title VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Doctor Reviews & Ratings
CREATE TABLE IF NOT EXISTS doctor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Chief Admin
INSERT INTO users (name, email, role, phone)
VALUES ('Sunny', 'admin.sunny@aurahealth.org', 'admin', '+91 99999 00000')
ON CONFLICT (email) DO NOTHING;
