import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  Stethoscope, 
  UserPlus, 
  KeyRound, 
  Flame, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const LoginModal = () => {
  const { 
    authModalOpen, 
    authModalInitialTab, 
    closeAuthModal, 
    loginAdmin, 
    loginUser, 
    registerPatient, 
    loginWithGoogle 
  } = useAuth();
  
  const { doctors, patients } = useData();

  // Mode: 'patient' (Front side) or 'admin' (Back side) for 3D Flip
  const [isFlippedToAdmin, setIsFlippedToAdmin] = useState(false);
  
  // Patient side tab: 'login' or 'register' (Admin has NO register tab as required)
  const [patientTab, setPatientTab] = useState('login');

  // Form states
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [adminUser, setAdminUser] = useState('Sunny');
  const [adminPass, setAdminPass] = useState('Sunny123');

  // Registration form
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'B+',
    age: '',
    gender: 'Male',
    password: '',
    allergies: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setIsFlippedToAdmin(authModalInitialTab === 'admin');
      setPatientTab('login');
      setErrorMessage('');
      // Default admin values pre-filled for convenience
      setAdminUser('Sunny');
      setAdminPass('Sunny123');
    }
  }, [authModalOpen, authModalInitialTab]);

  if (!authModalOpen) return null;

  // Handle User / Doctor Login
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!userEmail || !userPassword) {
      setErrorMessage('Please enter both Email and Password.');
      return;
    }

    setLoading(true);
    try {
      const res = loginUser(userEmail, userPassword, doctors, patients);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Patient Self-Registration
  const handlePatientRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regData.name || !regData.email || !regData.password) {
      setErrorMessage('Please fill in Name, Email and Password.');
      return;
    }

    setLoading(true);
    try {
      const res = registerPatient(regData);
      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Login (Sunny / Sunny123)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = loginAdmin(adminUser, adminPass);
      if (!res.success) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login (Firebase)
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Google Sign-In failed');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill Helpers
  const fillDemoPatient = () => {
    setUserEmail('rahul.sharma@example.com');
    setUserPassword('patient123');
    setErrorMessage('');
  };

  const fillDemoDoctor = () => {
    setUserEmail('dr.rajesh@aurahealth.com');
    setUserPassword('doctor123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg perspective-1000 my-8">
        
        {/* Top Tab Switcher to trigger 3D Flip */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
            <button
              onClick={() => { setIsFlippedToAdmin(false); setErrorMessage(''); }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                !isFlippedToAdmin 
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient & Doctor Portal</span>
            </button>

            <button
              onClick={() => { setIsFlippedToAdmin(true); setErrorMessage(''); }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isFlippedToAdmin 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Admin Portal</span>
              <span className="px-1.5 py-0.2 bg-purple-950 text-[10px] rounded border border-purple-400/40 text-purple-200">Sunny</span>
            </button>
          </div>
        </div>

        {/* 3D FLIP CONTAINER */}
        <div 
          className={`relative w-full transition-transform duration-700 transform-style-3d ${
            isFlippedToAdmin ? 'rotate-y-180' : ''
          }`}
        >
          
          {/* ======================================================== */}
          {/* 1. FRONT CARD: PATIENT & DOCTOR LOGIN / REGISTER */}
          {/* ======================================================== */}
          <div className="w-full bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden backface-hidden flex flex-col p-6 sm:p-8">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Patient & Doctor Portal</h3>
                  <p className="text-xs text-slate-400">Access your health records or clinical suite</p>
                </div>
              </div>

              <button
                onClick={closeAuthModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tab: Login vs Register (Register is ONLY for patients) */}
            <div className="flex items-center gap-2 mt-5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setPatientTab('login'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  patientTab === 'login' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setPatientTab('register'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  patientTab === 'register' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register New Patient
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* GOOGLE SIGN-IN BUTTON (Firebase powered) */}
            {patientTab === 'login' && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-3 transition shadow-md hover:border-cyan-500/40"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google (Firebase)</span>
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="h-px flex-1 bg-slate-800"></div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Or with credentials</span>
                  <div className="h-px flex-1 bg-slate-800"></div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SIGN IN */}
            {patientTab === 'login' ? (
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com or doctor email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Quick Demo Credentials */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
                    <span>⚡ Quick Demo Credentials:</span>
                    <span className="text-[10px] text-slate-500 font-normal">(Click to autofill)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillDemoPatient}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-cyan-950/50 border border-slate-700 text-[11px] font-medium text-slate-300 hover:text-cyan-300 text-left transition truncate"
                    >
                      👤 Rahul (Patient)
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoDoctor}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-cyan-950/50 border border-slate-700 text-[11px] font-medium text-slate-300 hover:text-cyan-300 text-left transition truncate"
                    >
                      🩺 Dr. Rajesh (Doctor)
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    *Note: Doctors are added by Admin. Doctors log in here with their credentials to access the Doctor Dashboard.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* TAB CONTENT: REGISTER NEW PATIENT */
              <form onSubmit={handlePatientRegister} className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765..."
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Blood Group</label>
                    <select
                      value={regData.bloodGroup}
                      onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                      className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Known Allergies / Chronic Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Dust allergy, Asthma (optional)"
                    value={regData.allergies}
                    onChange={(e) => setRegData({ ...regData, allergies: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Patient Account</span>
                </button>
              </form>
            )}

            {/* Flip to Admin Hint */}
            <div className="mt-5 pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setIsFlippedToAdmin(true)}
                className="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1.5 font-medium transition"
              >
                <span>Hospital Staff or Administrator?</span>
                <span className="font-bold underline">Switch to Admin Portal ➔</span>
              </button>
            </div>
          </div>


          {/* ======================================================== */}
          {/* 2. BACK CARD: ADMIN LOGIN (3D FLIP SIDE) */}
          {/* ======================================================== */}
          <div className="w-full bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden backface-hidden rotate-y-180 absolute inset-0 flex flex-col p-6 sm:p-8">
            
            {/* Admin Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Admin Control Portal</h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      SECURE
                    </span>
                  </div>
                  <p className="text-xs text-purple-300/80">Chief Hospital Administrator Access</p>
                </div>
              </div>

              <button
                onClick={closeAuthModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Admin Notice Banner: No Register Option Allowed */}
            <div className="mt-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-300">
                <Lock className="w-3.5 h-3.5" />
                <span>Default Master Admin Credentials:</span>
              </div>
              <div className="flex items-center justify-between bg-purple-950/80 p-2 rounded-xl border border-purple-700/40 mt-1">
                <div>
                  <span className="text-slate-400">Username: </span>
                  <span className="font-mono text-cyan-300 font-bold">Sunny</span>
                </div>
                <div>
                  <span className="text-slate-400">Password: </span>
                  <span className="font-mono text-cyan-300 font-bold">Sunny123</span>
                </div>
              </div>
              <p className="text-[10px] text-purple-400/80 pt-1">
                *Admin registration is disabled by system policy. Only pre-authorized root credentials can authenticate.
              </p>
            </div>

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin User ID</label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Sunny"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Secret Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Sunny123"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-purple-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Enter Admin Suite</span>
              </button>
            </form>

            {/* Flip back to Patient */}
            <div className="mt-auto pt-4 border-t border-purple-900/40 text-center">
              <button
                type="button"
                onClick={() => setIsFlippedToAdmin(false)}
                className="text-xs text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1.5 font-medium transition"
              >
                <span>Not an Admin?</span>
                <span className="font-bold underline">Flip back to Patient / Doctor Portal ➔</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
