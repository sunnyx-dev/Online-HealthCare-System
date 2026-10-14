# 🩺 AuraHealth - Architecture & System Design Document
**Enterprise Healthcare Management System with Core Java, JDBC & Servlets Engine**

---

## 1. Problem Understanding & Solution Design

### 1.1 The Healthcare Access Challenge
Traditional healthcare scheduling and outpatient department (OPD) management in clinics suffer from severe inefficiencies:
- **Scheduling Conflicts & Waiting Times:** Patients wait hours without knowing doctors' actual real-time availability. Double-booking is common.
- **Fragmented Medical Records:** Prescriptions, diagnoses, and clinical history are scattered across paper slips or disparate records.
- **Doctor Onboarding Security:** Unrestricted self-registration of medical practitioners leads to unverified doctor listings.
- **Language & Health Literacy Barriers:** Patients often describe symptoms in colloquial or regional languages (Hinglish/Hindi/English) and struggle to decipher complex medical lab reports (e.g., elevated HbA1c, borderline lipid panels, stages of hypertension).

### 1.2 The AuraHealth Solution Architecture
AuraHealth is engineered as a robust **3-Tier Enterprise Web Application** built upon four architectural pillars:
1. **Problem Understanding & Solution Design:** Comprehensive role-based workflows for Admin, Doctor, and Patient with a clear separation of concerns.
2. **Core Java Concepts:** Clean Object-Oriented Programming (Inheritance, Polymorphism, Abstraction, Encapsulation), Interfaces, Exception Handling hierarchies, Collections framework, Concurrency locking for slot reservation, and Design Patterns (DAO, Factory, Singleton, Service Layer).
3. **Database Integration (JDBC):** Normalized relational schema in MySQL with foreign key cascades, unique indexes, PreparedStatements against SQL injection, and ACID transaction demarcation (`commit`/`rollback`).
4. **Servlets & Web Integration:** HTTP request/response handling via Jakarta/Java Servlets, role-guarded session management, JSON REST APIs, and a lightweight zero-dependency embedded Java HTTP server.

```
+-------------------------------------------------------------------------+
|                         PRESENTATION LAYER                              |
|   Single-Page Responsive Web App (HTML5, Vanilla CSS3, JavaScript ES6)  |
|   • 4 Public Sections: Home | Services | Doctor | Login                 |
|   • 3D Flip Card Modal (Patient Login + Firebase Google / Admin Login)  |
|   • 3 Dashboards: Admin Dashboard | Doctor Dashboard | Patient Dashboard |
|   • Multilingual AI Health Assistant (Hinglish / Hindi / English)       |
+------------------------------------+------------------------------------+
                                     | JSON REST API / HTTP Fetch
                                     v
+-------------------------------------------------------------------------+
|                  CONTROLLER & SERVLET LAYER (Java Web)                  |
|   • AuthServlet      • UsersServlet        • DoctorsServlet             |
|   • SlotsServlet     • AppointmentsServlet • HistoryServlet             |
|   • ReviewsServlet   • ProfileServlet      • SettingsServlet            |
|   • AnalyticsServlet • AiServlet           • AuraServer (Embedded)      |
+------------------------------------+------------------------------------+
                                     | Service Invocations
                                     v
+-------------------------------------------------------------------------+
|                      SERVICE & BUSINESS LOGIC LAYER                     |
|   • SlotService: Dynamic schedule slot partitioning & availability     |
|   • AiService: Natural language symptom matcher & lab report parser    |
|   • PasswordUtil: PBKDF2/SHA-256 secure password hashing                |
|   • Concurrency Controls: Synchronized slot reservation locks          |
+------------------------------------+------------------------------------+
                                     | Data Access Objects (DAO)
                                     v
+-------------------------------------------------------------------------+
|                     DATA ACCESS LAYER (JDBC & DAOs)                     |
|   • BaseDao (Connection pool, PreparedStatements, RowMapper interface)  |
|   • UserDAO, AppointmentDAO, HistoryDAO, ReviewDAO, SettingsDAO         |
+------------------------------------+------------------------------------+
                                     | JDBC Connection (MySQL 8)
                                     v
+-------------------------------------------------------------------------+
|                          PERSISTENCE LAYER                              |
|   MySQL Relational Database: aurahealth                                 |
|   • users           • appointments       • medical_history              |
|   • reviews         • settings           • admin                        |
+-------------------------------------------------------------------------+
```

---

## 2. Core Java Concepts Applied

### 2.1 Object-Oriented Programming (OOP)
- **Inheritance (`User -> Doctor`):**
  `User.java` encapsulates core identity (`id`, `name`, `email`, `role`, `phone`).
  `Doctor.java` extends `User` with clinical attributes: `specialization`, `workingDays` (List of Day-of-Week integers), `startTime`, and `endTime`.
- **Encapsulation:** All model entities employ private fields with immutable records or validated getter/setter accessors.
- **Polymorphism & Abstraction:**
  `Dao<T>` interface establishes generic CRUD contracts:
  ```java
  public interface Dao<T> {
      List<T> findAll();
      Optional<T> findById(int id);
      boolean delete(int id);
  }
  ```
  Concrete classes `UserDAO`, `AppointmentDAO`, `ReviewDAO`, and `HistoryDAO` implement customized persistence behavior.

### 2.2 Exception Handling Hierarchy
```
Throwable
 └── Exception
      ├── RuntimeException
      │    ├── ApiException (HTTP status code + client message)
      │    │    ├── AuthenticationException (401 Unauthorized)
      │    │    ├── AuthorizationException (403 Forbidden)
      │    │    ├── ValidationException (400 Bad Request)
      │    │    └── ResourceNotFoundException (404 Not Found)
      │    └── DataException (Wraps low-level SQLExceptions)
```

### 2.3 Java Collections & Streams Framework
- `List<Doctor>` and `Set<String>` for tracking booked time slots.
- `Map<String, Object>` for JSON response generation.
- Dynamic slot calculation using Java 8+ Streams:
  ```java
  public List<String> calculateSlots(Doctor doctor, String date, int slotMinutes, Set<String> bookedTimes) {
      List<String> freeSlots = new ArrayList<>();
      LocalTime current = LocalTime.parse(doctor.getStartTime());
      LocalTime end = LocalTime.parse(doctor.getEndTime());
      while (current.plusMinutes(slotMinutes).compareTo(end) <= 0) {
          String slotStr = current.toString().substring(0, 5);
          if (!bookedTimes.contains(slotStr)) {
              freeSlots.add(slotStr);
          }
          current = current.plusMinutes(slotMinutes);
      }
      return freeSlots;
  }
  ```

### 2.4 Multithreading & Concurrency Management
To prevent **race conditions** when two patients concurrently attempt to book the exact same time slot for a doctor, the `book()` and `reschedule()` methods in `AppointmentDAO` utilize synchronized locking:
```java
public synchronized Optional<Appointment> book(int patientId, int doctorId, String date, String time) {
    if (taken(doctorId, date, time, 0)) {
        return Optional.empty(); // Slot already taken
    }
    int id = insert("INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time) VALUES (?,?,?,?)",
        patientId, doctorId, Date.valueOf(date), Time.valueOf(LocalTime.parse(time)));
    return findById(id);
}
```

---

## 3. Database Integration (JDBC)

### 3.1 Relational Schema Design
- **`admin`**: Secure storage for root admin credentials (`id`, `password_hash`).
- **`users`**: Unified accounts for patients and doctors. Includes doctor-specific schedule columns (`work_days`, `start_time`, `end_time`, `specialization`).
- **`appointments`**: Bookings with status (`Pending`, `Confirmed`, `Completed`, `Cancelled`), indexed by `(doctor_id, appt_date, appt_time)` to optimize slot lookups.
- **`medical_history`**: Longitudinal health records linked to patient and attending doctor.
- **`reviews`**: 1-to-5 star ratings and patient feedback per completed appointment.
- **`settings`**: Dynamic clinic configuration key-values.

### 3.2 Security & JDBC Best Practices
- **PreparedStatements:** 100% of SQL queries utilize parameterized statements (`?`) to prevent SQL Injection attacks.
- **Try-With-Resources:** Every `Connection`, `PreparedStatement`, and `ResultSet` is automatically closed to prevent memory leaks and connection starvation.
- **Password Hashing:** Salted SHA-256 / PBKDF2 hashing so plain-text passwords never touch the database.

---

## 4. Servlets & Web Integration

### 4.1 REST API Specification
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Authenticates patient or doctor |
| `/api/auth/register` | POST | Public | Registers a new patient |
| `/api/auth/admin` | POST | Public | Authenticates root admin (`Sunny123` / `Sunny_babu`) |
| `/api/auth/google` | POST | Public | Firebase Google ID-Token authentication |
| `/api/auth/logout` | POST | All | Invalidates HTTP session |
| `/api/auth/me` | GET | All | Returns current active user profile |
| `/api/users` | GET / POST | Admin | Lists all users or creates new user |
| `/api/users/{id}` | PUT / DELETE | Admin | Updates or removes user account |
| `/api/doctors` | GET / POST | Public / Admin | Public list or Admin doctor creation |
| `/api/doctors/me` | PUT | Doctor | Updates doctor's working schedule |
| `/api/slots` | GET | Authenticated | Computes free appointment slots |
| `/api/appointments` | GET / POST | Authenticated | Lists appointments or books a new slot |
| `/api/appointments/{id}` | PUT / DELETE | Doctor / Admin | Updates status, reschedules, or cancels |
| `/api/history` | GET / POST | Patient / Doctor | Retrieves or appends medical history notes |
| `/api/reviews` | GET / POST | Patient / Doctor | Submits or retrieves doctor ratings |
| `/api/profile` | GET / PUT | Authenticated | Reads or updates user's own profile |
| `/api/settings` | GET / PUT | Public / Admin | Retrieves or updates system configurations |
| `/api/analytics` | GET | Admin | Performance statistics & doctor workload |
| `/api/ai` | POST | Patient | Multilingual triage, slot search, lab report reading |

---

## 5. Role-Based Feature Matrix

| Feature | Admin Dashboard | Doctor Dashboard | Patient Dashboard |
|---|:---:|:---:|:---:|
| User Management (CRUD users) | ✅ Full | ❌ | ❌ |
| Doctor Provisioning (Manual account creation + credential card) | ✅ Full | ❌ | ❌ |
| Appointment Overview & Rescheduling | ✅ All Appointments | ✅ Own Appointments | ✅ Own Appointments |
| Schedule & Availability Management | ❌ | ✅ Working Days & Hours | ❌ |
| Patient Clinical Records & Notes | ❌ | ✅ View & Append Notes | ✅ View Own History |
| Appointment Booking & Live Slot Calculation | ❌ | ❌ | ✅ Interactive Booking |
| Doctor Review & 1-5 Star Rating | ❌ | 👁 View Feedback | ✅ Submit Review |
| System Settings (Slot length, clinic name, booking toggle) | ✅ Full | ❌ | ❌ |
| Performance Analytics & Workload Graphs | ✅ Full | ❌ | ❌ |
| AI Health Helper (Hinglish/Hindi/English Symptom Checker) | ❌ | ❌ | ✅ Conversational AI |
| AI Doctor Slot Inquiry ("kaun kab khali hai?") | ❌ | ❌ | ✅ Live Availability |
| AI Medical Lab Report Explainer (Hb, Sugar, BP, etc.) | ❌ | ❌ | ✅ Plain-language analysis |

---

## 6. How to Run

### Option A: Standalone Embedded Java Server (Port 8081)
Compiled with JDK 23 without requiring external Tomcat or Maven:
```powershell
# 1. Compile
javac -cp "lib/*" -d target/classes (Get-ChildItem -Path src/main/java -Recurse -Filter *.java | ForEach-Object { $_.FullName })

# 2. Run
java -cp "target/classes;lib/*" com.aurahealth.server.AuraServer
```
Open **http://localhost:8081** in any browser.

### Option B: Deploy WAR to Apache Tomcat
```powershell
mvn clean package
# Copy target/aurahealth.war to C:\xampp\tomcat\webapps\
```
Open **http://localhost:8080/aurahealth/**
