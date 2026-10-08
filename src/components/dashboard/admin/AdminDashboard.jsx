import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  Stethoscope, 
  Trash2, 
  Edit3, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Save, 
  Search, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Building, 
  AlertCircle, 
  X, 
  Lock, 
  Mail, 
  Phone 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

export const AdminDashboard = () => {
  const { currentUser, logout, setApiKeyModalOpen } = useAuth();
  const { 
    doctors, 
    patients, 
    appointments, 
    settings, 
    addDoctor, 
    deleteDoctor, 
    updateDoctor, 
    deleteUser, 
    updateAppointmentStatus, 
    updateSettings 
  } = useData();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'appointments', 'settings'
  const [userSubTab, setUserSubTab] = useState('doctors'); // 'doctors' or 'patients'
  
  // Add Doctor Modal State
  const [addDoctorModalOpen, setAddDoctorModalOpen] = useState(false);
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    email: '',
    specialty: 'Cardiology',
    qualification: 'MBBS, MD',
    experience: '5+ Years',
    fee: 600,
    timings: '09:00 AM - 02:00 PM',
    room: 'OPD Room 105',
    password: ''
  });
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('All');

  // Chart Data
  const monthlyConsultationsData = [
    { month: 'May', patients: 320, revenue: 195000 },
    { month: 'Jun', patients: 450, revenue: 270000 },
    { month: 'Jul', patients: 580, revenue: 348000 },
    { month: 'Aug', patients: 690, revenue: 414000 },
    { month: 'Sep', patients: 810, revenue: 486000 },
    { month: 'Oct', patients: 950, revenue: 570000 },
  ];

  const departmentDistributionData = [
    { name: 'Cardiology', value: 35, color: '#06b6d4' },
    { name: 'Neurology', value: 22, color: '#8b5cf6' },
    { name: 'Pediatrics', value: 18, color: '#f59e0b' },
    { name: 'Orthopedics', value: 15, color: '#10b981' },
    { name: 'Dermatology', value: 10, color: '#ec4899' },
  ];

  // Handle Add Doctor Submit
  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctorForm.name || !newDoctorForm.email) return;

    const res = addDoctor(newDoctorForm);
    if (res.success) {
      setCreatedCredentials(res.credentials);
      setNewDoctorForm({
        name: '',
        email: '',
        specialty: 'Cardiology',
        qualification: 'MBBS, MD',
        experience: '5+ Years',
        fee: 600,
        timings: '09:00 AM - 02:00 PM',
        room: 'OPD Room 105',
        password: ''
      });
    }
  };

  // Handle Settings Submit
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const totalRevenue = appointments.filter(a => a.status === 'Completed' || a.status === 'Confirmed').reduce((acc, a) => acc + (a.fee || 500), 0);

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Admin Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-purple-900/40 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Chief Admin Dashboard</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-400">Hospital Staff: <span className="text-purple-300 font-bold">Sunny</span> (Role: System Administrator)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Performance Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'users' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User &amp; Doctor Management</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'appointments' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>System Settings</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ======================================================== */}
        {/* TAB 1: PERFORMANCE ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Registered Patients</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{patients.length + 120}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +14.2% this month
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Doctors on Duty</span>
                  <Stethoscope className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{doctors.length}</div>
                <div className="text-[11px] text-cyan-400">Across 6 Clinical Specialties</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Appointments</span>
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">{appointments.length + 450}</div>
                <div className="text-[11px] text-amber-400">{appointments.filter(a => a.status === 'Confirmed').length} Confirmed Today</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Hospital OPD Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">₹{(totalRevenue + 570000).toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.5% Net Growth
                </div>
              </div>
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Monthly Trend Area Chart */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Patient Inflow &amp; Revenue Growth</h3>
                    <p className="text-xs text-slate-400">Monthly consultation volume analytics</p>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/40">
                    Live Telemetry
                  </span>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyConsultationsData}>
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="patients" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" name="Patients Consulted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution Pie Chart */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Department Workload</h3>
                  <p className="text-xs text-slate-400">Consultation distribution by specialty</p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentDistributionData}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {departmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {departmentDistributionData.map(dep => (
                    <div key={dep.name} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dep.color }}></span>
                        <span>{dep.name}</span>
                      </div>
                      <span className="font-bold">{dep.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 2: USER & DOCTOR MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
              
              {/* Doctors vs Patients Switch */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setUserSubTab('doctors')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    userSubTab === 'doctors' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Doctor Management ({doctors.length})
                </button>
                <button
                  onClick={() => setUserSubTab('patients')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    userSubTab === 'patients' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Patient Accounts ({patients.length})
                </button>
              </div>

              {/* Add Doctor Button (Doctor cannot self register, admin adds them!) */}
              {userSubTab === 'doctors' && (
                <button
                  onClick={() => { setCreatedCredentials(null); setAddDoctorModalOpen(true); }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Doctor &amp; Generate Credentials</span>
                </button>
              )}
            </div>

            {/* DOCTORS TABLE */}
            {userSubTab === 'doctors' ? (
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="px-6 py-4">Doctor Details</th>
                        <th className="px-6 py-4">Specialty &amp; Room</th>
                        <th className="px-6 py-4">OPD Schedule</th>
                        <th className="px-6 py-4">Fee &amp; Rating</th>
                        <th className="px-6 py-4">Login Password</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {doctors.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-400/30" />
                              <div>
                                <div className="font-bold text-white text-sm">{doc.name}</div>
                                <div className="text-[11px] text-slate-400">{doc.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-semibold">
                              {doc.specialty}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-1">{doc.room}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{doc.timings}</div>
                            <div className="text-[10px] text-slate-400">{doc.availableDays?.join(', ')}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">₹{doc.fee}</div>
                            <div className="text-[11px] text-amber-400">⭐ {doc.rating} ({doc.reviewsCount || 0})</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-purple-300 font-bold">
                            {doc.password || 'doctor123'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteDoctor(doc.id)}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition"
                              title="Remove Doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* PATIENTS TABLE */
              <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="px-6 py-4">Patient Profile</th>
                        <th className="px-6 py-4">Contact Phone</th>
                        <th className="px-6 py-4">Blood Group &amp; Age</th>
                        <th className="px-6 py-4">Allergies / Conditions</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {patients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={pat.avatar} alt={pat.name} className="w-10 h-10 rounded-xl object-cover border border-emerald-400/30" />
                              <div>
                                <div className="font-bold text-white text-sm">{pat.name}</div>
                                <div className="text-[11px] text-slate-400">{pat.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-300">
                            {pat.phone}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/40">
                              {pat.bloodGroup}
                            </span>
                            <span className="text-slate-400 ml-2">Age: {pat.age || 30}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {pat.allergies || 'None'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteUser(pat.id)}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Patient Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 3: APPOINTMENT MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filter Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
              <div className="text-sm font-bold text-white">
                Hospital Master Appointments Queue ({appointments.length})
              </div>

              <div className="flex items-center gap-2">
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setAppointmentFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      appointmentFilter === st 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Appointment ID</th>
                      <th className="px-6 py-4">Patient Name</th>
                      <th className="px-6 py-4">Assigned Doctor</th>
                      <th className="px-6 py-4">Date &amp; Time</th>
                      <th className="px-6 py-4">Symptoms / Reason</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {appointments
                      .filter(a => appointmentFilter === 'All' || a.status === appointmentFilter)
                      .map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4 font-mono font-bold text-cyan-300">
                            #{apt.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{apt.patientName}</div>
                            <div className="text-[11px] text-slate-400">{apt.patientPhone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{apt.doctorName}</div>
                            <div className="text-[11px] text-cyan-400">{apt.department}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{apt.date}</div>
                            <div className="text-[11px] text-slate-400">{apt.time}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-slate-400">
                            {apt.symptoms}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              apt.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40' :
                              apt.status === 'Completed' ? 'bg-cyan-950 text-cyan-300 border-cyan-800/40' :
                              apt.status === 'Pending' ? 'bg-amber-950 text-amber-300 border-amber-800/40' :
                              'bg-rose-950 text-rose-300 border-rose-800/40'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {apt.status !== 'Confirmed' && apt.status !== 'Completed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold"
                                >
                                  Approve
                                </button>
                              )}
                              {apt.status !== 'Cancelled' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold"
                                >
                                  Cancel
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

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 4: SYSTEM SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Building className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Hospital Configuration &amp; System Settings</h3>
                    <p className="text-xs text-slate-400">Manage hospital parameters, emergency contacts, and automation rules</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setApiKeyModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition flex items-center gap-2"
                >
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configure Cloud APIs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital / Medical Center Name</label>
                  <input
                    type="text"
                    value={settingsForm.hospitalName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">24x7 Emergency Hotline</label>
                  <input
                    type="text"
                    value={settingsForm.emergencyPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={settingsForm.operatingHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Approve Appointment Bookings</div>
                    <div className="text-[11px] text-slate-400">Instantly mark patient appointments as Confirmed without manual review</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.autoApproveAppointments}
                    onChange={(e) => setSettingsForm({ ...settingsForm, autoApproveAppointments: e.target.checked })}
                    className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Enable Aura AI Healthcare Assistant</div>
                    <div className="text-[11px] text-slate-400">Allow patients to use AI symptom triage and schedule inquiries</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.enableAiAssistant}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableAiAssistant: e.target.checked })}
                    className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save System Configurations</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: ADMIN ADDS DOCTOR & GENERATES CREDENTIALS */}
      {/* ======================================================== */}
      {addDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Add Doctor &amp; Issue Credentials</h3>
              </div>
              <button onClick={() => setAddDoctorModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdCredentials ? (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Doctor Account Created Successfully!</span>
                </div>
                <p className="text-xs text-slate-300">
                  Please send these credentials to the doctor. They can use them on the <strong>Patient &amp; Doctor Login</strong> page to access the Doctor Suite:
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                  <div><span className="text-slate-400">Doctor Email: </span><span className="text-cyan-300 font-bold">{createdCredentials.email}</span></div>
                  <div><span className="text-slate-400">Assigned Password: </span><span className="text-purple-300 font-bold">{createdCredentials.password}</span></div>
                </div>
                <button
                  onClick={() => { setAddDoctorModalOpen(false); setCreatedCredentials(null); }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddDoctor} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sameer Khan"
                      value={newDoctorForm.name}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Doctor Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="dr.sameer@aurahealth.com"
                      value={newDoctorForm.email}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Specialty</label>
                    <select
                      value={newDoctorForm.specialty}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, specialty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Oncology', 'Dentistry'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="MBBS, MD, DM"
                      value={newDoctorForm.qualification}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      placeholder="600"
                      value={newDoctorForm.fee}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, fee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Custom Password (optional)</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={newDoctorForm.password}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">OPD Timings</label>
                    <input
                      type="text"
                      placeholder="09:00 AM - 02:00 PM"
                      value={newDoctorForm.timings}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, timings: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">OPD Room</label>
                    <input
                      type="text"
                      placeholder="OPD Room 204"
                      value={newDoctorForm.room}
                      onChange={(e) => setNewDoctorForm({ ...newDoctorForm, room: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Doctor Account &amp; Save</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
