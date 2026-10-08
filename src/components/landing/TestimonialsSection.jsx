import React from 'react';
import { Star, Quote, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TestimonialsSection = () => {
  const { reviews } = useData();

  return (
    <section id="testimonials" className="py-24 bg-slate-900/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Patient Satisfaction
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Real Stories From Our <span className="text-gradient">Recovered Patients</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Read authentic feedback from patients treated across our cardiology, neurology, pediatrics, and emergency departments.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.patientName}</h4>
                  <p className="text-[11px] text-cyan-400">Consulted {rev.doctorName}</p>
                </div>
                <span className="text-[10px] text-slate-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Accreditations Bar */}
        <div className="mt-16 pt-12 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <Award className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">NABH Certified</span>
            <span className="text-[10px] text-slate-400">National Healthcare Board</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">JCI International</span>
            <span className="text-[10px] text-slate-400">Global Clinical Safety</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">NABL Pathology</span>
            <span className="text-[10px] text-slate-400">Precision Lab Testing</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">ISO 9001:2020</span>
            <span className="text-[10px] text-slate-400">Quality Management</span>
          </div>
        </div>

      </div>
    </section>
  );
};
