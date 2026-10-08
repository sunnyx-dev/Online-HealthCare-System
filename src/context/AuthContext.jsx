import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogleFirebase } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('patient'); // 'patient' or 'admin'
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiHelperModalOpen, setAiHelperModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_auth_user');
    }
  }, [currentUser]);

  // Open Auth Modal
  const openAuthModal = (tab = 'patient') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // 1. Admin Login (Specific Default Credentials: Sunny / Sunny123)
  const loginAdmin = (username, password) => {
    if ((username === 'Sunny' || username === 'sunny' || username === 'admin') && password === 'Sunny123') {
      const adminUser = {
        id: 'admin_master',
        name: 'Sunny (Chief Administrator)',
        username: 'Sunny',
        email: 'admin.sunny@aurahealth.org',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setCurrentUser(adminUser);
      closeAuthModal();
      return { success: true, user: adminUser };
    }
    return { success: false, error: 'Invalid Admin credentials! Use ID: Sunny and Pass: Sunny123' };
  };

  // 2. Patient / Doctor Login (Email & Password)
  const loginUser = (email, password, doctorsList = [], registeredUsers = []) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if it's a Doctor in the system
    const matchedDoctor = doctorsList.find(d => d.email.toLowerCase() === cleanEmail);
    if (matchedDoctor) {
      // In AuraHealth, doctor credentials are created by Admin
      if (password === 'doctor123' || password === matchedDoctor.password || password.length >= 4) {
        const doctorUser = {
          id: matchedDoctor.id,
          name: matchedDoctor.name,
          email: matchedDoctor.email,
          role: 'doctor',
          specialty: matchedDoctor.specialty,
          doctorDetails: matchedDoctor,
          avatar: matchedDoctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
        };
        setCurrentUser(doctorUser);
        closeAuthModal();
        return { success: true, user: doctorUser };
      }
    }

    // Check registered patients or demo patient
    const matchedPatient = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (matchedPatient) {
      const patientUser = {
        ...matchedPatient,
        role: 'patient'
      };
      setCurrentUser(patientUser);
      closeAuthModal();
      return { success: true, user: patientUser };
    }

    // Standard demo patient fallback
    if (cleanEmail.includes('patient') || cleanEmail.includes('rahul') || cleanEmail.includes('@')) {
      const defaultPatient = {
        id: 'pat_1',
        name: cleanEmail.includes('rahul') ? 'Rahul Sharma' : 'Valued Patient',
        email: cleanEmail,
        role: 'patient',
        phone: '+91 98765 43210',
        bloodGroup: 'B+',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      setCurrentUser(defaultPatient);
      closeAuthModal();
      return { success: true, user: defaultPatient };
    }

    return { success: false, error: 'User not found. Please register or verify credentials.' };
  };

  // 3. Patient Self-Registration (Doctors cannot register themselves)
  const registerPatient = (patientData) => {
    const newPatient = {
      id: `pat_${Date.now()}`,
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone || '+91 90000 00000',
      bloodGroup: patientData.bloodGroup || 'O+',
      age: patientData.age || 25,
      gender: patientData.gender || 'Not specified',
      role: 'patient',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(patientData.email || 'patient')}`,
      allergies: patientData.allergies || 'None reported'
    };

    setCurrentUser(newPatient);
    closeAuthModal();
    return { success: true, user: newPatient };
  };

  // 4. Google Sign-In with Firebase
  const loginWithGoogle = async () => {
    try {
      const res = await loginWithGoogleFirebase();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        closeAuthModal();
        return { success: true, user: res.user };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  // Switch role directly for quick exploration
  const switchRole = (role, doctorsList = []) => {
    if (role === 'admin') {
      loginAdmin('Sunny', 'Sunny123');
    } else if (role === 'doctor') {
      const doc = doctorsList[0] || {
        id: 'doc_1',
        name: 'Dr. Rajesh Sharma',
        email: 'dr.rajesh@aurahealth.com',
        specialty: 'Cardiology'
      };
      setCurrentUser({
        id: doc.id,
        name: doc.name,
        email: doc.email,
        role: 'doctor',
        specialty: doc.specialty,
        doctorDetails: doc,
        avatar: doc.avatar
      });
    } else {
      setCurrentUser({
        id: 'pat_1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        role: 'patient',
        phone: '+91 98765 43210',
        bloodGroup: 'B+',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authModalOpen,
        authModalInitialTab,
        apiKeyModalOpen,
        aiHelperModalOpen,
        setApiKeyModalOpen,
        setAiHelperModalOpen,
        openAuthModal,
        closeAuthModal,
        loginAdmin,
        loginUser,
        registerPatient,
        loginWithGoogle,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
