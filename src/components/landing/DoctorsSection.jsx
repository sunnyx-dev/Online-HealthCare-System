import React, { useState } from 'react';
import { 
  Stethoscope, 
  Star, 
  Calendar, 
  Clock, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Award, 
  ArrowRight 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const DoctorsSection = ({ onBookDoctor }) => {
  const { doctors } = useData();
  const { openAuthModal } = useAuth();
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.qualification?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <section id="doctors" className="py-24 bg-slate-900/60 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" /> Certified Medical Board
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Consult With Our <span className="text-gradient">Specialist Doctors</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Book verified appointments with experienced physicians, surgeons, and pediatric specialists at AuraHealth.
          </p>
        </div>

        {/* Search & Specialty Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedSpecialty === spec
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between backdrop-blur-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Doctor Avatar & Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/30 group-hover:border-cyan-400 transition"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-1 -right-1" title="Active on Duty"></span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-cyan-400 mt-0.5">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 truncate">{doc.qualification}</p>
                  </div>
                </div>

                {/* Details Badges */}
                <div className="space-y-2 py-3 border-y border-slate-900 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Timings:
                    </span>
                    <span className="font-medium text-white">{doc.timings}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Experience:
                    </span>
                    <span className="font-medium text-white">{doc.experience}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> Days:
                    </span>
                    <span className="font-medium text-slate-200 text-[11px] truncate max-w-[160px]">
                      {doc.availableDays?.join(', ') || 'Mon-Sat'}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              {/* Card Footer: Fee & Booking Button */}
              <div className="pt-5 mt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Consultation Fee</span>
                  <span className="text-lg font-black text-white">₹{doc.fee}</span>
                </div>

                <button
                  onClick={() => openAuthModal('patient')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/10"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
            <p className="text-sm">No doctors found matching "{searchQuery}".</p>
          </div>
        )}

      </div>
    </section>
  );
};
