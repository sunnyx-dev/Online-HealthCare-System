import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  KeyRound, 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  Bot, 
  PhoneCall, 
  Menu, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured, isSupabaseConfigured, isGeminiConfigured } from '../../config/apiConfig';

export const Navbar = ({ onOpenBooking }) => {
  const { currentUser, openAuthModal, logout, setApiKeyModalOpen, setAiHelperModalOpen } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasAnyKey = isFirebaseConfigured() || isSupabaseConfigured() || isGeminiConfigured();

  return (
    <>
      {/* Top Notification / Emergency Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border-b border-cyan-900/30 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[11px] font-semibold animate-pulse border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 24/7 EMERGENCY
            </span>
            <span className="hidden sm:inline text-slate-400">Call Hospital Emergency Hotline:</span>
            <a href="tel:18002872911" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 1800-AURA-911
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAiHelperModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700/40 transition shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aura AI Doctor Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-cyan-900/40 shadow-2xl' : 'bg-slate-950/60 backdrop-blur-md border-b border-slate-800/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">Aura<span className="text-gradient">Health</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">AI Plus</span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider -mt-1">Smart Healthcare & Hospital System</p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1.5 shadow-inner">
            <a href="#home" className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition">Home</a>
            <a href="#services" className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition">Services</a>
            <a href="#doctors" className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition">Doctors</a>
            <a href="#ai-assistant" className="px-3.5 py-1.5 rounded-full text-sm font-medium text-cyan-300 hover:text-white hover:bg-cyan-950/60 transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Helper
            </a>
          </nav>

          {/* Action Buttons / User Status */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-full p-1.5 pr-4 shadow-lg">
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {currentUser.name?.split(' ')[0]}
                    {currentUser.role === 'admin' && <ShieldCheck className="w-3 h-3 text-purple-400" />}
                    {currentUser.role === 'doctor' && <Stethoscope className="w-3 h-3 text-cyan-400" />}
                    {currentUser.role === 'patient' && <UserCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400 block -mt-0.5">
                    {currentUser.role} Portal
                  </span>
                </div>

                <a 
                  href="#dashboard-view"
                  className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </a>

                <button
                  onClick={logout}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('admin')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admin
                </button>

                <button
                  onClick={() => openAuthModal('patient')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Portal Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-cyan-900/40 px-6 py-4 space-y-3">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white font-medium"
            >Home</a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white font-medium"
            >Services</a>
            <a 
              href="#doctors" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white font-medium"
            >Doctors</a>
            <a 
              href="#ai-assistant" 
              onClick={() => { setMobileMenuOpen(false); setAiHelperModalOpen(true); }}
              className="block py-2 text-cyan-300 hover:text-white font-medium flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> Aura AI Health Helper
            </a>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <div className="text-sm font-semibold text-white">Logged in as {currentUser.name} ({currentUser.role})</div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-semibold text-sm text-center"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { openAuthModal('patient'); setMobileMenuOpen(false); }}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm text-center"
                  >
                    Patient / Doctor
                  </button>
                  <button
                    onClick={() => { openAuthModal('admin'); setMobileMenuOpen(false); }}
                    className="py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-purple-300 font-bold text-sm text-center"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
