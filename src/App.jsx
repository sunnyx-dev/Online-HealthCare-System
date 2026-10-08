import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { AuraAiHelperModal } from './components/ai/AuraAiHelperModal';
import { AdminDashboard } from './components/dashboard/admin/AdminDashboard';
import { DoctorDashboard } from './components/dashboard/doctor/DoctorDashboard';
import { PatientDashboard } from './components/dashboard/patient/PatientDashboard';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { 
  Bot, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  Sparkles, 
  Home, 
  LayoutDashboard, 
  KeyRound 
} from 'lucide-react';

export function App() {
  const { 
    currentUser, 
    apiKeyModalOpen, 
    setApiKeyModalOpen, 
    aiHelperModalOpen, 
    setAiHelperModalOpen, 
    switchRole, 
    logout 
  } = useAuth();
  
  const { doctors } = useData();
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'landing', 'dashboard'

  // Determine current active view
  const isDashboardActive = Boolean(currentUser && viewMode !== 'landing');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Universal Sticky Glass Navbar */}
      <Navbar />

      {/* Role Demonstration & View Quick-Switch Bar (Extremely useful for evaluators & admins) */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">⚡ Quick Persona Switcher:</span>
            <button
              onClick={() => { switchRole('patient', doctors); setViewMode('auto'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                currentUser?.role === 'patient' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient (Rahul)</span>
            </button>

            <button
              onClick={() => { switchRole('doctor', doctors); setViewMode('auto'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                currentUser?.role === 'doctor' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              <span>Doctor (Dr. Rajesh)</span>
            </button>

            <button
              onClick={() => { switchRole('admin', doctors); setViewMode('auto'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                currentUser?.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin (Sunny / Sunny123)</span>
            </button>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'landing' ? 'auto' : 'landing')}
                className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {viewMode === 'landing' ? (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View My {currentUser.role.toUpperCase()} Dashboard</span>
                  </>
                ) : (
                  <>
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Public Hospital Website</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {isDashboardActive ? (
          <div>
            {currentUser.role === 'admin' && <AdminDashboard />}
            {currentUser.role === 'doctor' && <DoctorDashboard />}
            {currentUser.role === 'patient' && <PatientDashboard />}
          </div>
        ) : (
          <LandingPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* 3D Flip Login & Auth Modal */}
      <LoginModal />

      {/* In-App API Configuration Modal (Firebase, Supabase, Gemini) */}
      <ApiKeyModal 
        isOpen={apiKeyModalOpen} 
        onClose={() => setApiKeyModalOpen(false)} 
      />

      {/* Floating / Dedicated Aura AI Health Assistant Modal */}
      <AuraAiHelperModal 
        isOpen={aiHelperModalOpen} 
        onClose={() => setAiHelperModalOpen(false)} 
      />

      {/* Floating Action Button: Quick Launch Aura AI */}
      <button
        onClick={() => setAiHelperModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-2xl shadow-cyan-500/30 hover:scale-110 hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2 group"
        title="Ask Aura AI Health Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-xs tracking-tight font-extrabold pr-1 hidden sm:inline group-hover:inline">
          Ask Aura AI
        </span>
      </button>

    </div>
  );
}
export default App;
