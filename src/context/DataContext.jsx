import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_MEDICAL_RECORDS, 
  INITIAL_REVIEWS, 
  INITIAL_SETTINGS,
  INITIAL_SERVICES 
} from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../config/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // 1. Doctors State
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_doctors');
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  // 2. Patients State
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // 3. Appointments State
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // 4. Medical Records State
  const [medicalRecords, setMedicalRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_medical_records');
      return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
    } catch {
      return INITIAL_MEDICAL_RECORDS;
    }
  });

  // 5. Reviews State
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 6. System Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [services] = useState(INITIAL_SERVICES);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('aura_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('aura_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('aura_medical_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('aura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aura_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- ADMIN ACTIONS ---
  // Admin manually adds a Doctor and generates login credentials
  const addDoctor = (doctorData) => {
    const generatedPassword = doctorData.password || `doc${Math.floor(1000 + Math.random() * 9000)}`;
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: doctorData.name.startsWith('Dr.') ? doctorData.name : `Dr. ${doctorData.name}`,
      email: doctorData.email.toLowerCase(),
      password: generatedPassword,
      specialty: doctorData.specialty || 'General Medicine',
      qualification: doctorData.qualification || 'MBBS, MD',
      experience: doctorData.experience || '5+ Years',
      fee: Number(doctorData.fee) || 500,
      rating: 5.0,
      reviewsCount: 0,
      avatar: doctorData.avatar || `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80`,
      timings: doctorData.timings || '09:00 AM - 02:00 PM',
      availableDays: doctorData.availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      bio: doctorData.bio || `Specialist in ${doctorData.specialty} at AuraHealth.`,
      room: doctorData.room || `OPD Room ${Math.floor(100 + Math.random() * 400)}`
    };

    setDoctors(prev => [newDoc, ...prev]);
    showToast(`Doctor ${newDoc.name} created successfully! Credentials sent.`);
    return { success: true, doctor: newDoc, credentials: { email: newDoc.email, password: generatedPassword } };
  };

  const updateDoctor = (id, updatedFields) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
    showToast("Doctor details updated successfully.");
  };

  const deleteDoctor = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    showToast("Doctor removed from system.", "warning");
  };

  const deleteUser = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    showToast("User account deleted successfully.", "warning");
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("System configurations saved successfully!");
  };

  // --- PATIENT ACTIONS ---
  const bookAppointment = (appointmentData) => {
    const newApt = {
      id: `apt_${Date.now().toString().slice(-4)}`,
      patientId: appointmentData.patientId || 'pat_1',
      patientName: appointmentData.patientName || 'Rahul Sharma',
      patientPhone: appointmentData.patientPhone || '+91 98765 43210',
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorEmail: appointmentData.doctorEmail,
      department: appointmentData.department,
      date: appointmentData.date,
      time: appointmentData.time,
      status: settings.autoApproveAppointments ? 'Confirmed' : 'Confirmed',
      symptoms: appointmentData.symptoms || 'General consultation',
      fee: appointmentData.fee || 500,
      paymentStatus: 'Paid',
      notes: appointmentData.notes || 'Appointment booked via Patient Portal'
    };

    setAppointments(prev => [newApt, ...prev]);
    showToast(`Appointment confirmed with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}!`);
    return newApt;
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    showToast("Appointment has been cancelled.", "warning");
  };

  const rescheduleAppointment = (id, newDate, newTime) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime, status: 'Confirmed' } : a));
    showToast(`Appointment rescheduled to ${newDate} at ${newTime}!`);
  };

  const updatePatientProfile = (patientId, profileData) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...profileData } : p));
    showToast("Profile details updated successfully!");
  };

  const addDoctorReview = (reviewData) => {
    const newRev = {
      id: `rev_${Date.now()}`,
      doctorId: reviewData.doctorId,
      doctorName: reviewData.doctorName,
      patientName: reviewData.patientName || 'Anonymous Patient',
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate doctor rating
    setDoctors(prev => prev.map(doc => {
      if (doc.id === reviewData.doctorId) {
        const docReviews = [...reviews.filter(r => r.doctorId === doc.id), newRev];
        const avg = (docReviews.reduce((acc, r) => acc + r.rating, 0) / docReviews.length).toFixed(1);
        return { ...doc, rating: Number(avg), reviewsCount: docReviews.length };
      }
      return doc;
    }));

    showToast("Thank you! Your review has been submitted.");
  };

  // --- DOCTOR ACTIONS ---
  const updateAppointmentStatus = (id, status, notes = '', prescription = '') => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          notes: notes || a.notes,
          prescription: prescription || a.prescription
        };
      }
      return a;
    }));

    // If marked completed and has prescription, also create a Medical Record automatically!
    if (status === 'Completed' && prescription) {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const newRecord = {
          id: `rec_${Date.now()}`,
          patientId: apt.patientId,
          patientName: apt.patientName,
          doctorName: apt.doctorName,
          date: apt.date,
          diagnosis: apt.symptoms || "Clinical Evaluation & Treatment",
          vitals: {
            bp: "120/80 mmHg",
            pulse: "72 bpm",
            temp: "98.6 °F",
            sugar: "99 mg/dL",
            spo2: "99%"
          },
          prescription: prescription,
          notes: notes || "Consultation successfully completed."
        };
        setMedicalRecords(prev => [newRecord, ...prev]);
      }
    }

    showToast(`Appointment status updated to ${status}!`);
  };

  const addMedicalRecord = (recordData) => {
    const newRecord = {
      id: `rec_${Date.now()}`,
      patientId: recordData.patientId || 'pat_1',
      patientName: recordData.patientName,
      doctorName: recordData.doctorName,
      date: recordData.date || new Date().toISOString().split('T')[0],
      diagnosis: recordData.diagnosis,
      vitals: recordData.vitals || { bp: "120/80 mmHg", pulse: "74 bpm", temp: "98.4 °F" },
      prescription: recordData.prescription,
      labReportTitle: recordData.labReportTitle || null,
      labReportUrl: recordData.labReportUrl || null,
      notes: recordData.notes || ""
    };

    setMedicalRecords(prev => [newRecord, ...prev]);
    showToast("Medical record saved and linked to patient file.");
    return newRecord;
  };

  return (
    <DataContext.Provider
      value={{
        doctors,
        patients,
        appointments,
        medicalRecords,
        reviews,
        settings,
        services,
        toastMessage,
        showToast,
        // Admin
        addDoctor,
        updateDoctor,
        deleteDoctor,
        deleteUser,
        updateSettings,
        // Patient
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        updatePatientProfile,
        addDoctorReview,
        // Doctor
        updateAppointmentStatus,
        addMedicalRecord
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-sm font-medium ${
            toastMessage.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-amber-500/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-500/20'
              : 'bg-slate-900/95 text-cyan-200 border-cyan-500/50 shadow-cyan-500/30'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
