import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  FileText,
  User,
  Star,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Phone,
  Mail,
  HeartPulse,
  ShieldCheck,
  Activity,
  Download,
  Upload,
  Save,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

export const PatientDashboard = ({ defaultTab = 'booking' }) => {
  const { currentUser, setAiHelperModalOpen } = useAuth();
  const {
    doctors,
    appointments,
    medicalRecords,
    bookAppointment,
    cancelAppointment,
    updatePatientProfile,
    addDoctorReview
  } = useData();

  const [activeTab, setActiveTab] = useState(defaultTab); // 'booking', 'history', 'records', 'profile', 'ai'

  // Booking Wizard States
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Review Modal State
  const [reviewDoctorModal, setReviewDoctorModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.sharma@example.com',
    phone: currentUser?.phone || '+91 98765 43210',
    bloodGroup: currentUser?.bloodGroup || 'B+',
    age: currentUser?.age || 32,
    emergencyContact: currentUser?.emergencyContact || '+91 98765 00000',
    allergies: currentUser?.allergies || 'Penicillin, Dust'
  });

  const myAppointments = appointments.filter(a =>
    a.patientEmail === currentUser?.email || a.patientName === currentUser?.name || a.patientId === currentUser?.id || a.patientId === 'pat_1'
  );

  const myRecords = medicalRecords.filter(r =>
    r.patientName === currentUser?.name || r.patientId === currentUser?.id || r.patientId === 'pat_1'
  );

  const selectedDoctorObj = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  // Handle Book Appointment
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctorObj) return;

    const newApt = bookAppointment({
      patientId: currentUser?.id || 'pat_1',
      patientName: currentUser?.name || 'Rahul Sharma',
      patientPhone: profileForm.phone,
      doctorId: selectedDoctorObj.id,
      doctorName: selectedDoctorObj.name,
      doctorEmail: selectedDoctorObj.email,
      department: selectedDoctorObj.specialty,
      date: bookingDate,
      time: bookingTime,
      symptoms: symptomsInput || "General consultation",
      fee: selectedDoctorObj.fee
    });

    // Confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) { }

    setBookingSuccess(newApt);
    setSymptomsInput('');
  };

  // Handle Profile Update
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updatePatientProfile(currentUser?.id || 'pat_1', profileForm);
  };

  // Handle Doctor Review Submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewDoctorModal) return;

    addDoctorReview({
      doctorId: reviewDoctorModal.doctorId,
      doctorName: reviewDoctorModal.doctorName,
      patientName: currentUser?.name || 'Rahul Sharma',
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewDoctorModal(null);
    setReviewComment('');
  };

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* Patient Header Banner */}
      <div className="bg-slate-900/90 border-b border-cyan-900/40 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3.5">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={currentUser?.name || "Patient"}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-400/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Welcome, {currentUser?.name || "Rahul Sharma"}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Patient ID: #{currentUser?.id?.slice(0, 7) || 'PAT-108'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Blood Group: <strong className="text-emerald-400">{profileForm.bloodGroup}</strong> • Phone: {profileForm.phone}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'booking' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'history' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Appointments ({myAppointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'records' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Medical History</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'profile' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setAiHelperModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span>Aura AI Doctor</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ======================================================== */}
        {/* TAB 1: APPOINTMENT BOOKING WIZARD */}
        {/* ======================================================== */}
        {activeTab === 'booking' && (
          <div className="space-y-8 animate-fadeIn">

            {bookingSuccess && (
              <div className="p-6 rounded-3xl bg-emerald-950/70 border border-emerald-500/50 space-y-3 shadow-2xl animate-fadeIn">
                <div className="flex items-center gap-3 text-emerald-300 font-bold text-base">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>Appointment Confirmed with {bookingSuccess.doctorName}!</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-2">
                  <div><span className="text-slate-400 block">Date:</span> <strong className="text-white">{bookingSuccess.date}</strong></div>
                  <div><span className="text-slate-400 block">Time Slot:</span> <strong className="text-cyan-300">{bookingSuccess.time}</strong></div>
                  <div><span className="text-slate-400 block">Department:</span> <strong className="text-white">{bookingSuccess.department}</strong></div>
                  <div><span className="text-slate-400 block">Status:</span> <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-bold">Confirmed</span></div>
                </div>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="mt-2 text-xs font-bold text-emerald-400 underline"
                >
                  Book Another Appointment
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Booking Form */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Book a Doctor Consultation</h3>
                  <p className="text-xs text-slate-400">Select department, choose specialist, pick slot and confirm</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-6">

                  {/* Step 1: Department & Specialty */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">1. Select Clinical Specialty</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'].map((dept) => (
                        <button
                          type="button"
                          key={dept}
                          onClick={() => {
                            setSelectedSpecialty(dept);
                            const firstDoc = doctors.find(d => d.specialty.includes(dept));
                            if (firstDoc) setSelectedDoctorId(firstDoc.id);
                          }}
                          className={`p-3 rounded-2xl text-xs font-bold border transition text-left ${selectedSpecialty === dept
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Choose Doctor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">2. Choose Available Specialist</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doctors.filter(d => d.specialty.includes(selectedSpecialty) || selectedSpecialty === 'General Medicine').map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctorId(doc.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${selectedDoctorId === doc.id
                              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg'
                              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                        >
                          <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold truncate">{doc.name}</h4>
                              <span className="text-[11px] text-amber-400 font-bold">⭐ {doc.rating}</span>
                            </div>
                            <p className="text-[11px] text-cyan-400">{doc.specialty}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Fee: ₹{doc.fee} • {doc.timings}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Pick Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">3. Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">4. Available OPD Time Slot</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {timeSlots.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 4: Symptoms Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">5. Describe Symptoms / Reason for Visit</label>
                    <textarea
                      rows="3"
                      placeholder="e.g. Experiencing persistent headache, fever for 2 days, and sore throat..."
                      value={symptomsInput}
                      onChange={(e) => setSymptomsInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm &amp; Book Appointment</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Doctor Summary & AI Assistant Trigger */}
              <div className="lg:col-span-4 space-y-6">

                {/* Doctor Details Card */}
                {selectedDoctorObj && (
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3.5 pb-3 border-b border-slate-800">
                      <img src={selectedDoctorObj.avatar} alt={selectedDoctorObj.name} className="w-14 h-14 rounded-2xl object-cover border border-cyan-400/40" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedDoctorObj.name}</h4>
                        <p className="text-xs text-cyan-400">{selectedDoctorObj.specialty}</p>
                        <p className="text-[11px] text-slate-400">{selectedDoctorObj.qualification}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">OPD Room:</span>
                        <span className="font-semibold text-white">{selectedDoctorObj.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Available Timings:</span>
                        <span className="font-semibold text-white">{selectedDoctorObj.timings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Consultation Fee:</span>
                        <span className="font-bold text-emerald-400">₹{selectedDoctorObj.fee}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
                      {selectedDoctorObj.bio}
                    </p>
                  </div>
                )}

                {/* AI Assistant Help Callout */}
                <div
                  onClick={() => setAiHelperModalOpen(true)}
                  className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/80 to-emerald-950/80 border border-cyan-500/40 cursor-pointer hover:border-cyan-400 transition group space-y-2"
                >
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <Bot className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition" />
                    <span>Confused which doctor to select?</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ask Aura AI in Hindi or English. Explain your symptoms and AI will suggest the best doctor &amp; timing for you!
                  </p>
                  <div className="text-[11px] text-cyan-400 font-bold underline pt-1 flex items-center gap-1">
                    <span>Talk to AI Health Helper</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 2: APPOINTMENT HISTORY */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">

            <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Your Appointment Bookings &amp; History</h3>
                <p className="text-xs text-slate-400">Track upcoming visits, cancellations, and doctor notes</p>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30"
              >
                + Book New Slot
              </button>
            </div>

            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Doctor &amp; Specialty</th>
                      <th className="px-6 py-4">Appointment Date &amp; Time</th>
                      <th className="px-6 py-4">Symptoms / Reason</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions / Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {myAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{apt.doctorName}</div>
                          <div className="text-[11px] text-cyan-400">{apt.department}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{apt.date}</div>
                          <div className="text-[11px] text-slate-400">{apt.time}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs text-slate-400">
                          {apt.symptoms}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${apt.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40' :
                              apt.status === 'Completed' ? 'bg-cyan-950 text-cyan-300 border-cyan-800/40' :
                                'bg-rose-950 text-rose-300 border-rose-800/40'
                            }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {apt.status === 'Completed' && (
                              <button
                                onClick={() => setReviewDoctorModal(apt)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-300" />
                                <span>Leave Review</span>
                              </button>
                            )}

                            {apt.status === 'Confirmed' && (
                              <button
                                onClick={() => cancelAppointment(apt.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold"
                              >
                                Cancel Slot
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Review Modal */}
            {reviewDoctorModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
                <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Rate {reviewDoctorModal.doctorName}</h3>
                    <button onClick={() => setReviewDoctorModal(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-125 transition"
                          >
                            <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback / Review</label>
                      <textarea
                        rows="3"
                        required
                        placeholder="Write about the doctor's diagnosis, behavior, and consultation experience..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:opacity-95"
                    >
                      Submit Doctor Review
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 3: MEDICAL HISTORY & RECORDS */}
        {/* ======================================================== */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fadeIn">

            <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Your Personal Health Records &amp; Diagnostic Reports</h3>
                <p className="text-xs text-slate-400">View past clinical diagnoses, vital statistics, and prescriptions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRecords.map((rec) => (
                <div key={rec.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rec.diagnosis}</h4>
                      <p className="text-xs text-cyan-400">Consulted {rec.doctorName}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{rec.date}</span>
                  </div>

                  {rec.vitals && (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">BP</span>
                        <span className="font-bold text-cyan-300">{rec.vitals.bp || '120/80'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Pulse</span>
                        <span className="font-bold text-emerald-300">{rec.vitals.pulse || '72 bpm'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Temp</span>
                        <span className="font-bold text-amber-300">{rec.vitals.temp || '98.6 °F'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Sugar</span>
                        <span className="font-bold text-purple-300">{rec.vitals.sugar || '98 mg/dL'}</span>
                      </div>
                    </div>
                  )}

                  {rec.prescription && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Doctor Prescription:
                      </span>
                      <p className="text-xs text-slate-300 whitespace-pre-line font-mono">{rec.prescription}</p>
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-xs text-slate-400 italic">
                      Notes: {rec.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 4: PROFILE MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">

            <form onSubmit={handleProfileSubmit} className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">Personal Profile &amp; Medical Info</h3>
                  <p className="text-xs text-slate-400">Update contact details, emergency phone, and allergies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={profileForm.emergencyContact}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={profileForm.allergies}
                    onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
