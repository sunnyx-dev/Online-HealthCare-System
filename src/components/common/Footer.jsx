import React from 'react';
import { HeartPulse, PhoneCall, Mail, MapPin, ShieldCheck, Sparkles, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Glow Ambient Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">Aura<span className="text-gradient">Health</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming modern clinical medicine with integrated AI diagnostics, smart scheduling, digitized EHR, and unified multi-portal hospital infrastructure.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> NABH & JCI Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> HIPAA Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-cyan-400 transition">Home & Overview</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition">Clinical Specialties & Services</a></li>
              <li><a href="#doctors" className="hover:text-cyan-400 transition">Our Specialist Doctors</a></li>
              <li><a href="#ai-assistant" className="hover:text-cyan-400 transition">Aura AI Health Assistant</a></li>
              <li><a href="#testimonials" className="hover:text-cyan-400 transition">Patient Stories & Reviews</a></li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Departments</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-cyan-400 transition cursor-pointer">Cardiology & Heart Care</span></li>
              <li><span className="hover:text-cyan-400 transition cursor-pointer">Neurology & Brain Sciences</span></li>
              <li><span className="hover:text-cyan-400 transition cursor-pointer">Pediatrics & Neonatal Care</span></li>
              <li><span className="hover:text-cyan-400 transition cursor-pointer">Orthopedics & Joint Center</span></li>
              <li><span className="hover:text-cyan-400 transition cursor-pointer">Dermatology & Skin Science</span></li>
              <li><span className="hover:text-cyan-400 transition cursor-pointer">24/7 Trauma & Emergency ICU</span></li>
            </ul>
          </div>

          {/* Emergency & Contacts */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Hospital Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Sector 62, Institutional Area, HealthTech Corridor, New Delhi - 110092</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-white font-semibold">1800-AURA-911 (Toll-Free Emergency)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>care@aurahealth.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AuraHealth Management System. All rights reserved. Created with modern AI standards.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">EHR Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
