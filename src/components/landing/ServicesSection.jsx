import React from 'react';
import { 
  HeartPulse, 
  Brain, 
  Baby, 
  Activity, 
  Sparkles, 
  Ambulance, 
  Microscope, 
  Video, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const ServicesSection = () => {
  const { services } = useData();
  const { openAuthModal } = useAuth();

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'Brain': return <Brain className="w-6 h-6 text-indigo-400" />;
      case 'Baby': return <Baby className="w-6 h-6 text-amber-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-pink-400" />;
      case 'Ambulance': return <Ambulance className="w-6 h-6 text-cyan-400" />;
      case 'Microscope': return <Microscope className="w-6 h-6 text-sky-400" />;
      case 'Video': return <Video className="w-6 h-6 text-teal-400" />;
      default: return <HeartPulse className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-950 relative border-t border-slate-900">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Clinical Centers of Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Specialized Medical Care &amp; <span className="text-gradient">Diagnostic Services</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From precision robotic surgeries to 24/7 cardiac ICU and AI-assisted digital pathology, AuraHealth delivers state-of-the-art medical solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((serv) => (
            <div
              key={serv.id}
              className={`p-6 rounded-3xl bg-slate-900/60 border ${serv.borderColor || 'border-slate-800'} backdrop-blur-md hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-xl`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getServiceIcon(serv.icon)}
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-slate-800">
                    {serv.badge || serv.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {serv.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => openAuthModal('patient')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group-hover:underline"
                >
                  <span>Book Specialist</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
