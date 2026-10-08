import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Plus, 
  Activity, 
  Stethoscope, 
  UserCheck, 
  Search, 
  FilePlus, 
  Save, 
  Phone, 
  Mail, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

export const DoctorDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { 
    appointments, 
    medicalRecords, 
    reviews, 
    doctors, 
    updateAppointmentStatus, 
    addMedicalRecord, 
    updateDoctor 
  } = useData();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'schedule', 'records', 'feedback'
  
  // Doctor identification
  const currentDoctor = doctors.find(d => d.email.toLowerCase() === currentUser?.email?.toLowerCase()) || doctors[0];

  // Doctor's filtered data
  const myAppointments = appointments.filter(a => 
    a.doctorId === currentDoctor.id || a.doctorName.toLowerCase().includes(currentDoctor.name.toLowerCase())
  );
  
  const myReviews = reviews.filter(r => 
    r.doctorId === currentDoctor.id || r.doctorName?.toLowerCase().includes(currentDoctor.name.toLowerCase())
  );

  // Active appointment for consultation notes
  const [selectedAptForConsult, setSelectedAptForConsult] = useState(null);
  const [consultNotes, setConsultNotes] = useState('');
  const [consultPrescription, setConsultPrescription] = useState('');

  // New EMR Record Form
  const [newRecordModalOpen, setNewRecordModalOpen] = useState(false);
  const [emrForm, setEmrForm] = useState({
    patientName: '',
    patientId: 'pat_1',
    diagnosis: '',
    bp: '120/80 mmHg',
    pulse: '74 bpm',
    temp: '98.6 °F',
    sugar: '100 mg/dL',
    spo2: '99%',
    prescription: '',
    notes: ''
  });

  // Schedule management states
  const [scheduleStatus, setScheduleStatus] = useState('Available');
  const [timingsInput, setTimingsInput] = useState(currentDoctor.timings || '09:00 AM - 02:00 PM');
  const [selectedDays, setSelectedDays] = useState(currentDoctor.availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    updateDoctor(currentDoctor.id, {
      timings: timingsInput,
      availableDays: selectedDays
    });
  };

  const handleCompleteConsultation = (e) => {
    e.preventDefault();
    if (!selectedAptForConsult) return;

    updateAppointmentStatus(
      selectedAptForConsult.id,
      'Completed',
      consultNotes,
      consultPrescription
    );

    setSelectedAptForConsult(null);
    setConsultNotes('');
    setConsultPrescription('');
  };

  const handleCreateEmr = (e) => {
    e.preventDefault();
    addMedicalRecord({
      patientId: emrForm.patientId,
      patientName: emrForm.patientName,
      doctorName: currentDoctor.name,
      diagnosis: emrForm.diagnosis,
      vitals: {
        bp: emrForm.bp,
        pulse: emrForm.pulse,
        temp: emrForm.temp,
        sugar: emrForm.sugar,
        spo2: emrForm.spo2
      },
      prescription: emrForm.prescription,
      notes: emrForm.notes
    });

    setNewRecordModalOpen(false);
    setEmrForm({
      patientName: '',
      patientId: 'pat_1',
      diagnosis: '',
      bp: '120/80 mmHg',
      pulse: '74 bpm',
      temp: '98.6 °F',
      sugar: '100 mg/dL',
      spo2: '99%',
      prescription: '',
      notes: ''
    });
  };

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Doctor Header Banner */}
      <div className="bg-slate-900/90 border-b border-cyan-900/40 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={currentDoctor.avatar} 
                alt={currentDoctor.name} 
                className="w-11 h-11 rounded-2xl object-cover border-2 border-cyan-400/40"
              />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">{currentDoctor.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  {currentDoctor.specialty}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentDoctor.qualification} • {currentDoctor.room}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'appointments' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments ({myAppointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'schedule' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule &amp; Availability</span>
            </button>

            <button
              onClick={() => setActiveTab('records')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'records' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Patient EMR Records</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'feedback' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Patient Feedback ({myReviews.length})</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ======================================================== */}
        {/* TAB 1: DOCTOR APPOINTMENTS OVERVIEW & CONSULTATION */}
        {/* ======================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Today's Confirmed Patients</span>
                <div className="text-2xl font-black text-cyan-400">
                  {myAppointments.filter(a => a.status === 'Confirmed').length}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Completed Consultations</span>
                <div className="text-2xl font-black text-emerald-400">
                  {myAppointments.filter(a => a.status === 'Completed').length}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Doctor Rating</span>
                <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>{currentDoctor.rating} / 5.0</span>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Assigned Patient Appointments</h3>
                <span className="text-xs text-slate-400">OPD Room: <strong className="text-cyan-400">{currentDoctor.room}</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Patient Details</th>
                      <th className="px-6 py-4">Slot Date &amp; Time</th>
                      <th className="px-6 py-4">Reported Symptoms</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Consultation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {myAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {apt.patientPhone || '+91 98765 43210'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{apt.date}</div>
                          <div className="text-[11px] text-cyan-400 font-semibold">{apt.time}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs text-slate-300">
                          {apt.symptoms}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            apt.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40' :
                            apt.status === 'Completed' ? 'bg-cyan-950 text-cyan-300 border-cyan-800/40' :
                            'bg-rose-950 text-rose-300 border-rose-800/40'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {apt.status === 'Confirmed' ? (
                            <button
                              onClick={() => {
                                setSelectedAptForConsult(apt);
                                setConsultNotes(apt.notes || '');
                                setConsultPrescription(apt.prescription || '');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5 ml-auto"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Start Consultation</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">
                              {apt.status === 'Completed' ? '✓ Consultation Done' : 'Cancelled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for In-Consultation Prescription & Clinical Notes */}
            {selectedAptForConsult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
                <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white">Consultation with {selectedAptForConsult.patientName}</h3>
                      <p className="text-xs text-cyan-400">Symptoms: {selectedAptForConsult.symptoms}</p>
                    </div>
                    <button onClick={() => setSelectedAptForConsult(null)} className="p-1.5 text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleCompleteConsultation} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Doctor Diagnosis &amp; Clinical Notes</label>
                      <textarea
                        rows="3"
                        required
                        placeholder="e.g. Mild viral rhinopharyngitis. Chest clear on auscultation. BP 122/80."
                        value={consultNotes}
                        onChange={(e) => setConsultNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Rx Digital Prescription (Medicines &amp; Dosage)</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="1. Tab Paracetamol 650mg (1-0-1 after food x 3 days)&#10;2. Tab Cetirizine 10mg (0-0-1 at night x 5 days)&#10;3. Warm water hydration & rest"
                        value={consultPrescription}
                        onChange={(e) => setConsultPrescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAptForConsult(null)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Prescription &amp; Complete Visit</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 2: SCHEDULE & AVAILABILITY MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'schedule' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <form onSubmit={handleSaveSchedule} className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">OPD Schedule &amp; Slot Availability</h3>
                    <p className="text-xs text-slate-400">Configure your active consultation days and daily slot timings</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  ● Currently On Duty
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Available Consultation Days</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {daysOfWeek.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition text-center ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily OPD Timings</label>
                <input
                  type="text"
                  value={timingsInput}
                  onChange={(e) => setTimingsInput(e.target.value)}
                  placeholder="09:00 AM - 02:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">Aura AI and Patient Booking Portal reflect this timing dynamically.</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update My Schedule</span>
                </button>
              </div>
            </form>
          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 3: PATIENT EMR MEDICAL RECORDS */}
        {/* ======================================================== */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Electronic Medical Records (EMR / EHR)</h3>
                <p className="text-xs text-slate-400">Access and document comprehensive clinical histories</p>
              </div>

              <button
                onClick={() => setNewRecordModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
              >
                <FilePlus className="w-4 h-4" />
                <span>Create New Medical Record</span>
              </button>
            </div>

            {/* Medical Records List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicalRecords.map((rec) => (
                <div key={rec.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rec.patientName}</h4>
                      <p className="text-xs text-cyan-400">{rec.diagnosis}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{rec.date}</span>
                  </div>

                  {/* Vitals */}
                  {rec.vitals && (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">BP</span>
                        <span className="font-bold text-cyan-300">{rec.vitals.bp || '120/80'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Pulse</span>
                        <span className="font-bold text-emerald-300">{rec.vitals.pulse || '74 bpm'}</span>
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

                  {/* Prescription */}
                  {rec.prescription && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" /> Prescribed Treatment:
                      </span>
                      <p className="text-xs text-slate-300 whitespace-pre-line font-mono">{rec.prescription}</p>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500">
                    Attending Doctor: <strong>{rec.doctorName}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal to create new Medical Record */}
            {newRecordModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
                <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Create Patient Medical Entry</h3>
                    <button onClick={() => setNewRecordModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleCreateEmr} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Patient Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Rahul Sharma"
                        value={emrForm.patientName}
                        onChange={(e) => setEmrForm({ ...emrForm, patientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Diagnosis / Assessment *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acute Bronchitis"
                        value={emrForm.diagnosis}
                        onChange={(e) => setEmrForm({ ...emrForm, diagnosis: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400">BP</label>
                        <input
                          type="text"
                          value={emrForm.bp}
                          onChange={(e) => setEmrForm({ ...emrForm, bp: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Pulse</label>
                        <input
                          type="text"
                          value={emrForm.pulse}
                          onChange={(e) => setEmrForm({ ...emrForm, pulse: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Temp</label>
                        <input
                          type="text"
                          value={emrForm.temp}
                          onChange={(e) => setEmrForm({ ...emrForm, temp: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Sugar</label>
                        <input
                          type="text"
                          value={emrForm.sugar}
                          onChange={(e) => setEmrForm({ ...emrForm, sugar: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Prescription</label>
                      <textarea
                        rows="3"
                        placeholder="Medicines and dosage instructions"
                        value={emrForm.prescription}
                        onChange={(e) => setEmrForm({ ...emrForm, prescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:opacity-95"
                    >
                      Save EMR Record
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 4: PATIENT FEEDBACK & RATINGS */}
        {/* ======================================================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Patient Reviews &amp; Testimonials</h3>
                  <p className="text-xs text-slate-400">Real feedback submitted by patients after completed consultations</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-amber-400 font-bold bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{currentDoctor.rating} Rating Average</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {myReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-white text-xs">{rev.patientName}</div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
