import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Languages, 
  Clock, 
  FileText, 
  Stethoscope, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AiAssistantTeaser = () => {
  const { setAiHelperModalOpen } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  const aiFeatures = [
    {
      title: "Multi-Language Symptom Checker",
      badge: "Hindi • Hinglish • English",
      icon: Languages,
      desc: "Apni bhasha me bimari aur symptoms batayein. AI instant analysis karke hospital ke sahi doctor recommend karega.",
      demoUser: "Mujhe 2 din se chest heavy aur saans lene me dikkat ho rahi hai.",
      demoAi: "Namaste! Aapke symptoms ke aadhar par Cardiology consultation zaroori hai. Dr. Rajesh Sharma (Cardiologist, OPD: 09:00 AM) available hain."
    },
    {
      title: "Real-Time Doctor Timings & Availability",
      badge: "Instant Schedule Lookup",
      icon: Clock,
      desc: "Puchhiye 'Dr. Ananya kab free hain?' ya 'Konsa neurologist subah available hai?' AI live schedule bata dega.",
      demoUser: "Dr. Ananya Sen kab khali hain OPD appointment ke liye?",
      demoAi: "Dr. Ananya Sen (Neurologist) Monday, Wednesday aur Friday ko 10:00 AM se 04:00 PM tak OPD me available hain."
    },
    {
      title: "Medical Lab Report Explainer",
      badge: "Smart Diagnostic Decoder",
      icon: FileText,
      desc: "Blood sugar, Lipid profile, CBC, ya ECG report ke values dalein. AI simple language me normal vs abnormal parameters samjhata hai.",
      demoUser: "Mera Fasting Blood Sugar 145 mg/dL aaya hai, yeh kya darshata hai?",
      demoAi: "Normal Fasting Sugar 70-99 mg/dL hota hai. 145 mg/dL elevated level hai. Kripya General Medicine specialist se consult karein."
    }
  ];

  return (
    <section id="ai-assistant" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      {/* Background Aura Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature Switcher */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4 text-cyan-400" /> Powered by Google Gemini AI
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Aura AI Health Assistant: <br />
              <span className="text-gradient">Doctor Finding &amp; Medical Helper</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No more confusion about which specialist to visit or what lab test numbers mean. Aura AI understands everyday natural language (Hindi / English / Hinglish) and provides instant clinical navigation.
            </p>

            {/* Feature Tabs */}
            <div className="space-y-3 pt-2">
              {aiFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                const isActive = activeFeature === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFeature(idx)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-start gap-4 ${
                      isActive 
                        ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-500/10 scale-[1.01]' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{feat.title}</h4>
                        <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/40">
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setAiHelperModalOpen(true)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-xl shadow-cyan-500/20 transition flex items-center gap-2.5"
              >
                <Bot className="w-4 h-4" />
                <span>Try Live AI Assistant Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Chat Simulator */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-2xl space-y-4">
              
              {/* Chat Simulator Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-md">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Aura AI Live Consultation</h4>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Online &amp; Active
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800/40">
                  {aiFeatures[activeFeature].badge}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 py-2">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-lg">
                    <p>{aiFeatures[activeFeature].demoUser}</p>
                    <span className="text-[9px] text-cyan-100 opacity-80 block text-right mt-1">Patient • Just now</span>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="max-w-[85%] bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed space-y-2 shadow-lg">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AuraHealth AI Recommendation:</span>
                    </div>
                    <p>{aiFeatures[activeFeature].demoAi}</p>
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Instant Booking Available</span>
                      <span className="text-emerald-400 font-semibold">100% Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA footer inside card */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ask in your own words</span>
                <button
                  onClick={() => setAiHelperModalOpen(true)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
                >
                  <span>Launch Full AI Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
