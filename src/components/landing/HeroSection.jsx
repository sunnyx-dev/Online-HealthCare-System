import React from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  Bot, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  Star, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSection = ({ onOpenBooking, onDoctorSelect }) => {
  const { openAuthModal, setAiHelperModalOpen } = useAuth();

  return (
    <section id="home" className="relative pt-12 pb-24 overflow-hidden bg-grid-pattern">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">
                AuraHealth 2.0 • AI-Driven Hospital Ecosystem
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Intelligent Healthcare, <br />
              <span className="text-gradient">Instant Diagnostics</span> &amp; <br />
              Seamless Hospital Care.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              AuraHealth bridges patients, top-tier medical specialists, and hospital administrators through intuitive scheduling, real-time EHR records, and an intelligent multi-language AI Clinical Assistant.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => openAuthModal('patient')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition flex items-center gap-2.5 scale-100 hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Doctor Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAiHelperModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-sm hover:text-white shadow-xl shadow-slate-950/50 backdrop-blur-xl transition flex items-center gap-2.5"
              >
                <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>Ask Aura AI Helper</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Super-Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>NABH &amp; JCI Accredited Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Instant OPD Confirmations</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Hospital Dashboard Preview Glass Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Glass Visual Showcase */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-2xl space-y-5">
              
              {/* Top Card Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live OPD Status</h4>
                    <p className="text-[11px] text-cyan-400">Real-time Hospital Queue</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Now
                </span>
              </div>

              {/* Doctor Card Snippet */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5 hover:border-cyan-500/40 transition">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80" 
                  alt="Dr. Rajesh" 
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white truncate">Dr. Rajesh Sharma</h5>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> 4.9
                    </div>
                  </div>
                  <p className="text-[11px] text-cyan-400">Cardiology Specialist • 15+ Yrs</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Next Available: Today at 10:30 AM</p>
                </div>
              </div>

              {/* AI Helper Teaser Widget */}
              <div 
                onClick={() => setAiHelperModalOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-cyan-500/30 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Ask Aura AI Symptom Checker</div>
                    <div className="text-[10px] text-slate-400">"Mujhe sir dard aur bukhar hai..."</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
              </div>

              {/* Vital Telemetry Mini Metrics */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Avg Wait Time</span>
                  <span className="text-sm font-bold text-cyan-300">4 Mins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Doctors On Duty</span>
                  <span className="text-sm font-bold text-emerald-300">38 Active</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Patient Rating</span>
                  <span className="text-sm font-bold text-amber-300">⭐ 4.9/5.0</span>
                </div>
              </div>

            </div>

            {/* Floating Decorative Glass Badges */}
            <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-float hidden sm:flex">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">99.8% Success</span>
                <span className="text-xs font-bold text-emerald-300">Recovery Rate</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-3xl font-black text-cyan-400 block">50,000+</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Happy Patients Treated</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-3xl font-black text-emerald-400 block">120+</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Certified Specialist Doctors</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-3xl font-black text-purple-400 block">24/7</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">AI Triage &amp; Emergency Care</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="text-3xl font-black text-amber-400 block">100%</span>
            <span className="text-xs font-medium text-slate-400 mt-1 block">Secure Cloud EHR Records</span>
          </div>
        </div>

      </div>
    </section>
  );
};
