# 🩺 AuraHealth / Swasthya Mitra
### Enterprise Healthcare Management & Outpatient Scheduling System
**Engineered with Core Java (JDK 17+), Servlets & Standalone Embedded Server, JDBC, and Normalized MySQL 8**

[![GitHub Repository](https://img.shields.io/badge/GitHub-Public%20Repository-blue.svg)](https://github.com/sunnyx-dev/Online-HealthCare-System)
[![Java Version](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Jakarta Servlet](https://img.shields.io/badge/Jakarta%20Servlet-6.0-green.svg)](https://jakarta.ee/specifications/servlet/6.0/)
[![Database](https://img.shields.io/badge/MySQL-8.0%2B-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 📌 Repository Accessibility for Reviewers

> [!IMPORTANT]
> **GitHub Repository Visibility: PUBLIC**
> 
> This repository is public and immediately accessible to all reviewers without authentication:
> - **Public URL:** [https://github.com/sunnyx-dev/Online-HealthCare-System](https://github.com/sunnyx-dev/Online-HealthCare-System)
> - **HTTPS Clone URL:** `git clone https://github.com/sunnyx-dev/Online-HealthCare-System.git`
> - **SSH Clone URL:** `git clone git@github.com:sunnyx-dev/Online-HealthCare-System.git`

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key System Features](#-key-system-features)
3. [System Architecture](#-system-architecture)
4. [Repository & Project Structure](#-repository--project-structure)
5. [Core Java Concepts & Design Patterns](#-core-java-concepts--design-patterns)
6. [Prerequisites & Requirements](#-prerequisites--requirements)
7. [How to Run the Project (3 Quick Ways)](#-how-to-run-the-project)
   - [Method 1: Instant 1-Click Launch (Zero-Config In-Memory)](#method-1-instant-1-click-launch-recommended--zero-config)
   - [Method 2: Running with MySQL Database](#method-2-running-with-mysql-database)
   - [Method 3: Enterprise Apache Tomcat (WAR) Deployment](#method-3-enterprise-apache-tomcat-war-deployment)
8. [Default Test Accounts & Credentials](#-default-test-accounts--credentials)
9. [Multilingual AI Health Assistant & Lab Parser](#-multilingual-ai-health-assistant--lab-parser)
10. [Complete REST API Reference](#-complete-rest-api-reference)
11. [Reviewer Verification & Testing Checklist](#-reviewer-verification--testing-checklist)

---

## 🩺 Project Overview

**AuraHealth** (also known as *Swasthya Mitra*) is a full-stack, enterprise-grade healthcare management and outpatient department (OPD) scheduling system. Designed to bridge the communication gap between patients, doctors, and medical administrators, the platform delivers:

- **Seamless Outpatient Scheduling:** Real-time doctor slot availability calculation eliminating double-bookings and minimizing waiting times.
- **Centralized Electronic Health Records (EHR):** Confidential digital medical history and prescription records securely accessible by authorized medical practitioners.
- **Role-Based Access Control (RBAC):** Distinct dashboards and security domains for Clinic Administrators, Doctors, and Patients.
- **Multilingual AI Health Assistant:** Intelligent natural language symptom triage and blood lab report analyzer supporting English, Hindi, and Hinglish colloquial descriptions.
- **Dual Execution Engine:** Operates as either a lightweight zero-dependency standalone Java server on port `8081` (with resilient in-memory fallback) or as a packaged enterprise `.war` on Apache Tomcat 10.1+.

---

## 🌟 Key System Features

| Feature | Description | Target Role |
|---|---|---|
| **Real-time Slot Partitioning** | Dynamically computes open appointment slots based on doctor shift hours, interval duration, and existing reservations. | All Roles |
| **Race-Condition Protected Booking** | Employs synchronized Java thread monitors to prevent two patients from reserving the same slot concurrently. | Patients |
| **Multilingual AI Triage** | Rule-based NLP classifier matching symptoms in English/Hindi/Hinglish to appropriate medical specialties and doctors. | Patients |
| **Lab Report Quantitative Parser** | Analyzes values for Hemoglobin, Blood Sugar/Glucose, Cholesterol, and Blood Pressure, providing preliminary health indicators. | Patients |
| **Electronic Health Records (EHR)** | Secure digital diagnosis notes and prescriptions maintained chronologically with doctor authorization checks. | Doctors & Patients |
| **Verified Feedback & Reviews** | Post-consultation 1-to-5 star ratings with verified visit verification and aggregated doctor scorecards. | Doctors & Patients |
| **Administrative Control Center** | Onboards doctors, provisions user accounts, customizes slot durations, toggles booking status, and analyzes clinic KPIs. | Administrators |

---

## 🏛 System Architecture

The application is engineered as a clean **3-Tier Enterprise Web Architecture**:

```
+-----------------------------------------------------------------------------------+
|                              PRESENTATION LAYER                                   |
|   Responsive Single-Page Web Applications (HTML5, Vanilla CSS3, ES6 JavaScript)   |
|   • Public Portal (Landing, Specializations, Doctor Directory, 3D Login Modal)    |
|   • Admin Dashboard     • Doctor Dashboard     • Patient Dashboard                |
|   • Multilingual AI Medical Assistant (English, Hindi, Hinglish)                  |
+-----------------------------------------+-----------------------------------------+
                                          | JSON REST API (HTTP Fetch / Cookies)
                                          v
+-----------------------------------------------------------------------------------+
|                        CONTROLLER & SERVLET LAYER                                 |
|   Jakarta Servlets (Tomcat) & Standalone Java Embedded HTTP Server (AuraServer)   |
|   • AuthHandler / AuthServlet           • UsersHandler / UsersServlet             |
|   • DoctorsHandler / DoctorsServlet     • SlotsHandler / SlotsServlet             |
|   • AppointmentsHandler / Servlet       • HistoryHandler / HistoryServlet         |
|   • ReviewsHandler / ReviewsServlet     • SettingsHandler / SettingsServlet       |
|   • AnalyticsHandler / AnalyticsServlet • AiHandler / AiServlet                   |
+-----------------------------------------+-----------------------------------------+
                                          | Service Invocations
                                          v
+-----------------------------------------------------------------------------------+
|                         SERVICE & BUSINESS LOGIC LAYER                            |
|   • SlotService: Doctor working hours calculation, day-of-week checks & slots     |
|   • PasswordUtil: Salted PBKDF2 with HMAC-SHA256 (120,000 iterations)             |
|   • Concurrency Controls: Thread-safe synchronized slot reservation monitors      |
|   • Session Management: UUID tokens with session fixation rotation                |
+-----------------------------------------+-----------------------------------------+
                                          | Data Access Objects (DAO Pattern)
                                          v
+-----------------------------------------------------------------------------------+
|                       DATA ACCESS LAYER (JDBC & DAOs)                             |
|   • Generic Dao<T> CRUD Interface                                                 |
|   • BaseDao (PreparedStatement parameter binding, try-with-resources)             |
|   • UserDAO, AppointmentDAO, HistoryDAO, ReviewDAO, SettingsDAO, StatsDAO         |
+-----------------------------------------+-----------------------------------------+
                                          | JDBC Driver (MySQL Connector/J)
                                          v
+-----------------------------------------------------------------------------------+
|                             PERSISTENCE LAYER                                     |
|   MySQL Relational Database: aurahealth                                           |
|   • users (patients & doctors)          • appointments (with status enum)         |
|   • medical_history (EHR records)       • reviews (1-5 star ratings)              |
|   • settings (key-value clinic config)  • admin (credentials hash)                |
|   [Automatic Fallback: Resilient In-Memory Concurrent Store if MySQL is offline]  |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Repository & Project Structure

```
Aura health/
│
├── .gitignore                      # Git ignored files (classes, targets, IDE cache)
├── DESIGN_DOC.md                   # Detailed Architecture and System Design Document
├── README.md                       # Comprehensive Project Documentation (This File)
├── pom.xml                         # Maven build file for packaging Tomcat WAR
├── run.bat                         # 1-Click Windows Batch script (Compiles & Launches)
├── run.ps1                         # 1-Click PowerShell script (Compiles & Launches)
│
├── db/
│   └── schema.sql                  # Normalized MySQL DDL schema and initial seed data
│
├── lib/                            # Bundled JAR dependencies for zero-config compilation
│   ├── gson-2.10.1.jar             # Google Gson JSON serialization library
│   └── mysql-connector-j-8.0.33.jar# MySQL JDBC Type-4 Driver
│
├── admin-dashboard/                # Admin Web Application (Static assets)
│   ├── index.html                  # Admin analytics, doctor onboarding, and settings UI
│   ├── style.css                   # Responsive dark/light theme CSS styling
│   └── images/                     # Dashboard icons and imagery
│
├── doctor-dashboard/               # Doctor Web Application
│   ├── index.html                  # Schedule management, appointments, patient EHR UI
│   ├── style.css                   # Doctor portal responsive stylesheet
│   └── images/                     # Doctor dashboard assets
│
├── patient-dashboard/              # Patient Web Application
│   ├── index.html                  # Slot booking, EHR history, AI health assistant UI
│   ├── style.css                   # Patient portal responsive stylesheet
│   └── images/                     # Patient dashboard assets
│
└── src/
    └── main/
        ├── java/com/aurahealth/
        │   ├── dao/                # Data Access Layer (DAO Pattern)
        │   │   ├── Dao.java            # Generic CRUD interface contract
        │   │   ├── BaseDao.java        # Abstract JDBC helper (PreparedStatement safety)
        │   │   ├── AdminDAO.java       # Admin credential persistence
        │   │   ├── AppointmentDAO.java # Booking & synchronized slot reservation
        │   │   ├── HistoryDAO.java     # Electronic health record persistence
        │   │   ├── ReviewDAO.java      # Patient reviews & rating aggregations
        │   │   ├── SettingsDAO.java    # Key-value system configurations
        │   │   ├── StatsDAO.java       # Analytical aggregations and metrics
        │   │   └── UserDAO.java        # User & Doctor profile persistence
        │   │
        │   ├── model/              # Domain Entity Models (OOP Principles)
        │   │   ├── User.java           # Base user entity (Encapsulation)
        │   │   ├── Doctor.java         # Extends User with clinical fields (Inheritance)
        │   │   ├── Appointment.java    # Scheduled consultation entity
        │   │   ├── HistoryRecord.java  # Medical EHR record entity
        │   │   └── Review.java         # Doctor feedback and rating entity
        │   │
        │   ├── server/             # Embedded Standalone Engine
        │   │   └── AuraServer.java     # Lightweight zero-dependency HTTP REST server
        │   │
        │   ├── service/            # Business Logic Layer
        │   │   └── SlotService.java    # Dynamic schedule slot generation logic
        │   │
        │   ├── servlet/            # Jakarta Servlets (Tomcat Deployment)
        │   │   ├── ApiServlet.java     # Base controller with JSON and RBAC helpers
        │   │   ├── AppStartup.java     # ServletContextListener bootstrap
        │   │   ├── AuthServlet.java    # Authentication, login, register, logout
        │   │   ├── UsersServlet.java   # Admin user management
        │   │   ├── DoctorsServlet.java # Doctor listings and schedule setup
        │   │   ├── SlotsServlet.java   # Free slot inquiries
        │   │   ├── AppointmentsServlet.java # Appointment booking and status updates
        │   │   ├── HistoryServlet.java # Medical records management
        │   │   ├── ReviewsServlet.java # Doctor ratings and feedback
        │   │   ├── ProfileServlet.java # Self-service profile updates
        │   │   ├── SettingsServlet.java# System settings management
        │   │   ├── AnalyticsServlet.java# Clinic KPIs and metrics
        │   │   └── AiServlet.java      # Multilingual AI triage & lab report parser
        │   │
        │   └── util/               # Cross-Cutting Utilities
        │       ├── ApiException.java   # Custom unchecked REST error exception
        │       ├── DataException.java  # Custom unchecked persistence exception
        │       ├── Db.java             # JDBC connection factory
        │       ├── FirebaseVerifier.java # Google OAuth Firebase token verifier
        │       └── PasswordUtil.java   # Salted PBKDF2-HMAC-SHA256 password security
        │
        └── webapp/                 # Packaged Web Application Root
            ├── index.html          # Public landing portal & 3D login flip card
            ├── logo.png            # Official brand logo
            ├── firebase-config.js  # Optional Firebase client configuration
            ├── admin-dashboard/    # Synced admin frontend
            ├── doctor-dashboard/   # Synced doctor frontend
            └── patient-dashboard/  # Synced patient frontend
```

---

## 💻 Core Java Concepts & Design Patterns

The codebase strictly follows professional Java coding standards and modern software design patterns:

### 1. Object-Oriented Programming (OOP)
- **Inheritance (`User -> Doctor`):**
  `User.java` encapsulates generic account properties (`id`, `name`, `email`, `role`, `phone`).
  `Doctor.java` extends `User` with clinical attributes (`specialization`, `workDays`, `startTime`, `endTime`, `rating`).
- **Encapsulation:** All model entities maintain private fields with clean, validated getter/setter methods.
- **Polymorphism & Abstraction:**
  The generic `Dao<T>` interface establishes uniform persistence contracts (`findAll()`, `findById()`, `delete()`) implemented by domain-specific DAOs.

### 2. Design Patterns
- **Data Access Object (DAO) Pattern:** Decouples business logic from SQL mechanics and schema definitions.
- **Template Method Pattern:** `BaseDao` provides execution templates (`query`, `update`, `insert`, `count`) that handle statement preparation, parameter binding, and result set traversal.
- **Service Layer Pattern:** `SlotService` isolates complex date/time partitioning algorithms from web controllers.
- **Functional Programming:** Uses Java functional interfaces (`RowMapper<T>`), Java Streams, and lambdas for data transformations.

### 3. Concurrency & Thread Safety
- **Race Condition Prevention:** `AppointmentDAO.book(...)` and `AppointmentDAO.reschedule(...)` use Java `synchronized` method monitors to guarantee atomic slot reservation.
- **Thread-Safe Memory Fallback:** `AuraServer` uses `ConcurrentHashMap` and `CopyOnWriteArrayList` to ensure safe multi-threaded access when running in in-memory mode.

### 4. Enterprise Security Standards
- **SQL Injection Immunization:** 100% of database queries use `PreparedStatement` parameter placeholders (`?`). No concatenated user input.
- **Cryptographic Password Hashing:** `PasswordUtil` implements PBKDF2 with HMAC-SHA256, 120,000 iterations, 128-bit cryptographically secure random salts, and constant-time byte array comparison.
- **Session Fixation Defense:** Servlets invoke `HttpServletRequest.changeSessionId()` upon successful login.

---

## ⚙ Prerequisites & Requirements

| Component | Minimum Requirement | Notes |
|---|---|---|
| **Operating System** | Windows 10/11, macOS, or Linux | Cross-platform |
| **Java JDK** | **JDK 17** or higher | Verify via `java -version` and `javac -version` |
| **MySQL Database** | MySQL 8.0+ *(Optional)* | Optional! System includes zero-config in-memory fallback |
| **Apache Maven** | Maven 3.8+ *(Optional)* | Only required if building `.war` for Tomcat |
| **Web Browser** | Chrome, Edge, Firefox, Safari | Modern ES6 support |

---

## 🚀 How to Run the Project

### Method 1: Instant 1-Click Launch (Recommended — Zero Config)

The repository includes pre-configured automation scripts that compile the Core Java engine and start the embedded server on port `8081`. **No database setup or Maven installation is required!**

#### On Windows:
1. Simply double-click **`run.bat`** in the project root, **OR** run from terminal:
   ```cmd
   cd "c:\Users\Sunny Kumar\Desktop\Aura health"
   run.bat
   ```
2. The script will:
   - Compile all Java sources in `src/main/java` into `target/classes`.
   - Free port `8081` if previously occupied.
   - Automatically open `http://localhost:8081/index.html` in your default browser.
   - Start the standalone `AuraServer` engine.

#### Using PowerShell:
```powershell
.\run.ps1
```

> [!TIP]
> If MySQL is not running on your machine, `AuraServer` automatically detects it and starts in **Resilient In-Memory Mode**, pre-populated with demo doctors, sample appointments, and patient records so reviewers can test every feature instantly!

---

### Method 2: Running with MySQL Database

To connect the application to a persistent MySQL database:

1. **Start MySQL Server** and import the database schema:
   ```bash
   mysql -u root -p < db/schema.sql
   ```
2. **Configure Environment Variables** (if your MySQL username/password differ from defaults):
   - `DB_URL`: `jdbc:mysql://localhost:3306/aurahealth`
   - `DB_USER`: `root` (default)
   - `DB_PASS`: `your_mysql_password`
3. **Start the Server:**
   ```cmd
   run.bat
   ```
   *The server console will output:* `✔ Connected to MySQL Database (aurahealth). Admin account verified.`

---

### Method 3: Enterprise Apache Tomcat (WAR) Deployment

To deploy AuraHealth as a standard Jakarta Servlet web application on Apache Tomcat:

1. **Build the WAR package with Maven:**
   ```bash
   mvn clean package
   ```
   *This compiles the sources and produces `target/aurahealth.war`.*
2. **Deploy to Tomcat:**
   - Copy `target/aurahealth.war` into your Tomcat installation's `webapps/` folder (Apache Tomcat 10.1 or higher).
   - Start Tomcat: `bin/startup.bat` (Windows) or `bin/startup.sh` (Linux/Mac).
3. **Access the Application:**
   - Open your browser to: `http://localhost:8080/aurahealth/`

---

## 🔑 Default Test Accounts & Credentials

The system comes pre-seeded with accounts across all three roles for instant testing:

### 🛡️ Administrator Account
- **Portal URL:** Click **Admin Login** on the home page or open `/admin-dashboard/index.html`
- **Admin ID:** `Sunny123`
- **Password:** `Sunny_babu`
- **Capabilities:** Onboard doctors, provision users, manage settings, view clinic KPI analytics.

### 🩺 Doctor Accounts
- **Portal URL:** Login via the main portal or open `/doctor-dashboard/index.html`
- **Credentials:**
  | Doctor Name | Specialty | Email | Password |
  |---|---|---|---|
  | **Dr. Asha Rao** | Cardiology | `asha@aura.health` | `Doc@101` |
  | **Dr. Vikram Mehta** | General Physician | `vikram@aura.health` | `Doc@102` |
  | **Dr. Neha Kapoor** | Dermatology | `neha@aura.health` | `Doc@103` |
  | **Dr. Rohan Iyer** | Orthopedics | `rohan@aura.health` | `Doc@104` |
- **Capabilities:** Configure OPD working hours, confirm/complete appointments, view patient medical records, inspect reviews.

### 👤 Demo Patient Account
- **Portal URL:** Open `/patient-dashboard/index.html`
- **Email:** `rahul@gmail.com`
- **Password:** `Patient@123`
- **Self-Registration:** You can also register a brand new patient account directly from the main page login modal!
- **Capabilities:** Discover doctors, book appointments, chat with AI triage assistant, view medical records, submit reviews.

---

## 🤖 Multilingual AI Health Assistant & Lab Parser

AuraHealth features an intelligent conversational assistant accessible from the Patient Dashboard. It understands natural language input in **English, Hindi, and Hinglish**:

### Sample Prompts to Try:
1. **Symptom Triage (Hindi / Hinglish):**
   - *"mere seene me dard ho raha hai aur saans phool rahi hai"* → Recommends **Dr. Asha Rao (Cardiology)** with available OPD slots.
   - *"skin pe red daane aur khujli ho rahi hai"* → Recommends **Dr. Neha Kapoor (Dermatology)**.
   - *"ghutne me aur kamar me bohot tezz dard hai"* → Recommends **Dr. Rohan Iyer (Orthopedics)**.
   - *"sir dard aur tezz bukhar hai do din se"* → Recommends **Dr. Vikram Mehta (General Physician)**.
2. **Doctor Availability Query:**
   - *"Dr. Asha kab khali hain?"* or *"kaun sa doctor available hai?"* → Lists real-time OPD availability.
3. **Medical Lab Report Parsing:**
   - *"Hemoglobin 9.8, Sugar 165, BP 150/95"*
   - The AI assistant parses the numerical values, detects **low Hemoglobin (Anemia alert)**, **elevated Blood Glucose (Diabetes alert)**, and **Hypertension Stage (High BP)**, and advises scheduling a consultation with the appropriate doctor.

---

## 📡 Complete REST API Reference

All endpoints accept and return `application/json` with UTF-8 encoding:

| HTTP Method | Endpoint Path | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates patient or doctor credentials; returns session cookie. |
| `POST` | `/api/auth/register` | Public | Registers a new patient account (`{name, email, password, phone}`). |
| `POST` | `/api/auth/admin` | Public | Authenticates administrator credentials (`{id, password}`). |
| `POST` | `/api/auth/google` | Public | Firebase Google OAuth token authentication. |
| `POST` | `/api/auth/logout` | Logged In | Terminates session and clears cookies. |
| `GET` | `/api/auth/me` | Logged In | Retrieves current authenticated session user profile. |
| `GET` | `/api/doctors` | Public | Returns list of all doctors with aggregate star ratings. |
| `POST` | `/api/doctors` | Admin | Onboards a new doctor (`{name, specialization, email, password}`). |
| `PUT` | `/api/doctors/me` | Doctor | Updates doctor's own working days and shift hours. |
| `GET` | `/api/slots` | Logged In | Queries available slots (`?doctorId={id}&date={YYYY-MM-DD}`). |
| `GET` | `/api/appointments` | Logged In | Returns role-scoped appointments (Patient/Doctor/Admin). |
| `POST` | `/api/appointments` | Patient | Reserves an appointment slot (`{doctorId, date, time}`). |
| `PUT` | `/api/appointments/{id}` | Logged In | Updates status (`Confirmed`, `Completed`, `Cancelled`) or reschedules. |
| `GET` | `/api/history` | Logged In | Retrieves medical history records (Patient/Doctor/Admin). |
| `POST` | `/api/history` | Patient/Doc | Appends new medical prescription or diagnosis note. |
| `GET` | `/api/reviews` | Logged In | Returns patient reviews for a doctor (`?doctorId={id}`). |
| `POST` | `/api/reviews` | Patient | Submits 1-5 star review for a completed appointment. |
| `GET` | `/api/profile` | Logged In | Retrieves own account profile. |
| `PUT` | `/api/profile` | Logged In | Updates own account details and password. |
| `GET` | `/api/settings` | Public | Retrieves clinic name, slot duration, and booking toggle. |
| `PUT` | `/api/settings` | Admin | Updates global clinic operational settings. |
| `GET` | `/api/analytics` | Admin | Returns clinic KPI counts and breakdown totals. |
| `POST` | `/api/ai` | Patient | Sends symptom or lab report message to AI triage assistant. |

---

## ✅ Reviewer Verification & Testing Checklist

Reviewers can verify all project evaluation criteria following this quick 5-step test walkthrough:

- [x] **1. Verify Public Repository:** Open [https://github.com/sunnyx-dev/Online-HealthCare-System](https://github.com/sunnyx-dev/Online-HealthCare-System) in an incognito/private browser window to verify public accessibility.
- [x] **2. 1-Click Launch:** Run `run.bat` or `.\run.ps1`. Verify that compilation succeeds and the browser opens `http://localhost:8081/index.html`.
- [x] **3. Admin Flow:** Log in with `Sunny123` / `Sunny_babu`. View analytics charts, onboard a new doctor, and verify the settings tab.
- [x] **4. Patient Booking & AI Flow:** Log in as `rahul@gmail.com` / `Patient@123`. Chat with the AI assistant (`"sir dard hai"` or paste `"Hemoglobin 10.2, Sugar 160"`), select a doctor, and book an appointment slot.
- [x] **5. Doctor Flow:** Log in as `asha@aura.health` / `Doc@101`. View the scheduled appointment, mark it confirmed or completed, inspect patient medical history, and view patient reviews.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
Developed by **Sunny Kumar** ([@sunnyx-dev](https://github.com/sunnyx-dev)).

