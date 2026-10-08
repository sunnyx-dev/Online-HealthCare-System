# 🩺 AuraHealth - Next-Gen Smart Healthcare & AI Management System

A comprehensive, state-of-the-art Web-based Healthcare Management Platform featuring an **AI Health Assistant (Google Gemini)**, **Patient Portal**, **Doctor Clinical Suite**, and **Master Admin Control System**.

---

## 🌟 Key Highlights & Core Features

### 1. 🌐 Public Landing Portal (AuraHealth)
- **Sections**: Home, Clinical Services (8 Centers of Excellence), Specialist Doctors, AI Health Assistant, and Patient Testimonials.
- **Glassmorphism & Micro-animations**: Modern aesthetic with glowing indicators, emergency hotline integration, and live telemetry.
- **24/7 Emergency Integration**: Direct hotline link to `1800-AURA-911`.

---

### 2. 🔄 3D Card Flip Auth Modal (Patient/Doctor & Admin)
- **Pop-up Modal**: Triggered when clicking "Portal Login" or "Admin".
- **3D Card Flip Animation**: Smooth perspective card flipping when transitioning between Patient/Doctor and Admin portals.
- **Patient & Doctor Portal**:
  - Google Sign-In with Google Firebase Authentication support.
  - Email / Password Login.
  - **Patient Registration**: New patients can register self-accounts.
  - **Doctor Login**: Doctors cannot self-register. They are added by the Admin and log in here using their admin-issued credentials to access their Doctor Dashboard.
- **Admin Portal**:
  - **No Registration Option** (system security policy).
  - **Default Master Admin Credentials**:
    - **User ID**: `Sunny`
    - **Password**: `Sunny123`

---

### 3. 🤖 Aura AI Healthcare Assistant
- **Multi-Language Support**: Fluently understands symptoms in **Hindi**, **English**, and **Hinglish**.
- **Symptom Triage & Doctor Recommendation**: Evaluates user health complaints and matches the exact specialist doctor in the hospital database.
- **Doctor Timings & Schedule Finder**: Answers inquiries like *"Dr. Ananya kab khali hain?"* with active OPD timings and slot availability.
- **Medical Lab Report Interpreter**: Decodes test values (Blood Sugar, BP, Lipid Profile, CBC) into clear, reassuring explanations with dietary guidance.
- **Google Gemini 1.5 Flash API**: Live generation when API key is provided, with an intelligent built-in fallback clinical engine.

---

### 4. 🎛️ Unified Portals & Dashboards

#### A. 🛡️ Master Admin Dashboard
1. **User & Doctor Management**:
   - Add new doctors with auto-generated passwords, consultation fees, OPD room, and schedules.
   - Credentials are generated and displayed to provide directly to the doctor.
   - View, edit, and delete doctor and patient profiles.
2. **Appointment Management**:
   - Oversee all hospital appointments across departments.
   - Filter by status: *Confirmed, Pending, Completed, Cancelled*.
   - Instant approval or cancellation.
3. **Performance Analytics**:
   - Real-time Recharts graphs for monthly patient trends and department workload distribution.
   - Hospital revenue tracking and KPI stat counters.
4. **System Settings**:
   - Configure hospital metadata, emergency numbers, operating hours, and auto-approval rules.

#### B. 🩺 Doctor Dashboard
1. **Schedule Management**:
   - Interactive availability manager: toggle active days, update daily consultation hours.
2. **Patient EMR / EHR Records**:
   - Access electronic medical records, record vitals (BP, Pulse, Temp, Sugar, SpO2).
   - Write clinical assessments and issue digital prescriptions.
3. **Appointment Overview & Consultation**:
   - View today's queue of confirmed patients.
   - One-click "Start Consultation" with diagnosis input and prescription writer.
4. **Patient Feedback**:
   - View ratings and patient testimonials.

#### C. 👤 Patient Dashboard
1. **Appointment Booking Wizard**:
   - 5-step intuitive booking (Department ➔ Doctor ➔ Date ➔ Time Slot ➔ Reason).
   - Confetti celebration upon successful booking!
2. **Appointment History**:
   - Track upcoming and past visits with real-time status badges.
3. **Medical History & EHR**:
   - Review past prescriptions, recorded vitals, and doctor instructions.
4. **Profile Management**:
   - Update contact information, blood group, age, emergency contact, and allergies.
5. **Doctor Review**:
   - Submit star ratings and reviews after completed appointments.

---

## 🔑 Default Credentials & Quick Login

| Role | Username / Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `Sunny` | `Sunny123` | Admin Portal |
| **Doctor (Demo)** | `dr.rajesh@aurahealth.com` | `doctor123` | Patient & Doctor Portal |
| **Patient (Demo)** | `rahul.sharma@example.com` | `patient123` | Patient & Doctor Portal |

---

## ⚙️ How to Configure API Keys

You can enter your API keys either in `src/config/apiConfig.js` or directly inside the app using the **"Configure API Keys"** button on the top navigation bar:

1. **Google Firebase**:
   - `apiKey`, `authDomain`, `projectId`, `appId`
2. **Supabase (PostgreSQL)**:
   - `url`, `anonKey`
   - SQL schema available in `backend/schema.sql`
3. **Google Gemini AI**:
   - `apiKey` from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
