// AuraHealth Realistic Healthcare Data

export const INITIAL_DOCTORS = [
  {
    id: "doc_1",
    name: "Dr. Rajesh Sharma",
    email: "dr.rajesh@aurahealth.com",
    specialty: "Cardiology",
    qualification: "MBBS, MD, DM (Cardiology), FACC",
    experience: "15+ Years",
    fee: 800,
    rating: 4.9,
    reviewsCount: 142,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    timings: "09:00 AM - 02:00 PM",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    bio: "Senior Consultant Interventional Cardiologist specializing in preventive heart care, angioplasty, and hypertension management.",
    room: "OPD Room 102, Cardiology Wing"
  },
  {
    id: "doc_2",
    name: "Dr. Ananya Sen",
    email: "dr.ananya@aurahealth.com",
    specialty: "Neurology",
    qualification: "MBBS, MD (Medicine), DM (Neurology)",
    experience: "12+ Years",
    fee: 900,
    rating: 4.8,
    reviewsCount: 118,
    avatar: "https://images.unsplash.com/photo-1594824813583-3c97825b263b?auto=format&fit=crop&w=300&q=80",
    timings: "10:00 AM - 04:00 PM",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    bio: "Leading Neurophysician specializing in stroke rehabilitation, migraine therapy, and neuro-critical care.",
    room: "OPD Room 204, Neurosciences Wing"
  },
  {
    id: "doc_3",
    name: "Dr. Priya Deshmukh",
    email: "dr.priya@aurahealth.com",
    specialty: "Pediatrics",
    qualification: "MBBS, DCH, DNB (Pediatrics)",
    experience: "10+ Years",
    fee: 600,
    rating: 4.9,
    reviewsCount: 165,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    timings: "11:00 AM - 05:00 PM",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    bio: "Compassionate Child Specialist expert in newborn care, child immunization, and pediatric nutrition.",
    room: "OPD Room 301, Child Health Wing"
  },
  {
    id: "doc_4",
    name: "Dr. Vikram Malhotra",
    email: "dr.vikram@aurahealth.com",
    specialty: "Orthopedics",
    qualification: "MBBS, MS (Orthopedics), M.Ch",
    experience: "14+ Years",
    fee: 750,
    rating: 4.7,
    reviewsCount: 94,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    timings: "08:30 AM - 01:30 PM",
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
    bio: "Joint Replacement and Sports Injury Surgeon with over 2000 successful arthroscopic and knee surgeries.",
    room: "OPD Room 108, Bone & Joint Care"
  },
  {
    id: "doc_5",
    name: "Dr. Neha Kapoor",
    email: "dr.neha@aurahealth.com",
    specialty: "Dermatology",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    experience: "8+ Years",
    fee: 650,
    rating: 4.9,
    reviewsCount: 130,
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80",
    timings: "02:00 PM - 07:00 PM",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    bio: "Cosmetic & Clinical Dermatologist expert in clinical acne therapies, laser treatments, and hair-loss solutions.",
    room: "OPD Room 405, Skin & Aesthetic Wing"
  },
  {
    id: "doc_6",
    name: "Dr. Amitav Roy",
    email: "dr.amitav@aurahealth.com",
    specialty: "General Medicine",
    qualification: "MBBS, MD (General Medicine)",
    experience: "18+ Years",
    fee: 500,
    rating: 4.9,
    reviewsCount: 210,
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=300&q=80",
    timings: "09:00 AM - 06:00 PM",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bio: "Senior Physician for chronic disease management, diabetes reversal counseling, infectious diseases, and executive health checks.",
    room: "OPD Room 101, Ground Floor"
  }
];

export const INITIAL_SERVICES = [
  {
    id: "serv_1",
    title: "Cardiology & Heart Care",
    category: "Specialized Care",
    icon: "HeartPulse",
    description: "Comprehensive non-invasive & interventional cardiac diagnostics, ECG, 2D Echo, TMT, and preventive heart screenings.",
    color: "from-rose-500/20 to-red-500/5",
    borderColor: "border-rose-500/30",
    badge: "24/7 CathLab Active"
  },
  {
    id: "serv_2",
    title: "Neurology & Brain Sciences",
    category: "Advanced Diagnostics",
    icon: "Brain",
    description: "Advanced EEG, EMG, Stroke ICU, Epilepsy care, Migraine management, and advanced neuro-rehabilitation therapies.",
    color: "from-indigo-500/20 to-purple-500/5",
    borderColor: "border-indigo-500/30",
    badge: "AI Neuro-Imaging"
  },
  {
    id: "serv_3",
    title: "Pediatrics & Child Care",
    category: "Family Health",
    icon: "Baby",
    description: "Dedicated neonatal ICU (NICU), growth monitoring, vaccination, pediatric emergencies, and child psychology.",
    color: "from-amber-500/20 to-yellow-500/5",
    borderColor: "border-amber-500/30",
    badge: "Level 3 NICU"
  },
  {
    id: "serv_4",
    title: "Orthopedics & Joint Care",
    category: "Surgical Center",
    icon: "Activity",
    description: "Minimally invasive joint replacements, robotic orthopedic surgeries, fracture trauma care, and sports physiotherapy.",
    color: "from-emerald-500/20 to-teal-500/5",
    borderColor: "border-emerald-500/30",
    badge: "Robotic Surgery"
  },
  {
    id: "serv_5",
    title: "Dermatology & Skin Center",
    category: "Aesthetics & Care",
    icon: "Sparkles",
    description: "Advanced laser treatments, medical acne management, eczema therapies, allergy testing, and aesthetic skin care.",
    color: "from-pink-500/20 to-fuchsia-500/5",
    borderColor: "border-pink-500/30",
    badge: "US-FDA Approved Tech"
  },
  {
    id: "serv_6",
    title: "24/7 Smart Emergency & Trauma",
    category: "Critical Care",
    icon: "Ambulance",
    description: "Ultra-fast response ICU on wheels, ACLS ambulances, polytrauma resuscitation team, and instant triage care.",
    color: "from-cyan-500/20 to-blue-500/5",
    borderColor: "border-cyan-500/30",
    badge: "Instant 5-Min Response"
  },
  {
    id: "serv_7",
    title: "AI-Powered Diagnostics & Labs",
    category: "Pathology & Imaging",
    icon: "Microscope",
    description: "Automated high-throughput robotic pathology, digital X-Ray, 128-slice CT scan, 3T MRI, and instant cloud reports.",
    color: "from-sky-500/20 to-indigo-500/5",
    borderColor: "border-sky-500/30",
    badge: "NABL Accredited"
  },
  {
    id: "serv_8",
    title: "Tele-Consultation & Home Care",
    category: "Digital Health",
    icon: "Video",
    description: "HD video consultations, home sample collection, remote vitals monitoring, and doorstep medicine delivery.",
    color: "from-teal-500/20 to-emerald-500/5",
    borderColor: "border-teal-500/30",
    badge: "Global Access"
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "pat_1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "patient",
    phone: "+91 98765 43210",
    bloodGroup: "B+",
    age: 32,
    gender: "Male",
    emergencyContact: "+91 98765 00000 (Wife)",
    allergies: "Penicillin, Dust",
    address: "B-402, Green Valley Apartments, New Delhi",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "pat_2",
    name: "Pooja Verma",
    email: "pooja.verma@example.com",
    role: "patient",
    phone: "+91 98111 22334",
    bloodGroup: "O+",
    age: 28,
    gender: "Female",
    emergencyContact: "+91 98111 55667 (Mother)",
    allergies: "None",
    address: "74, Lotus Boulevard, Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "pat_3",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    role: "patient",
    phone: "+91 99223 34455",
    bloodGroup: "A+",
    age: 45,
    gender: "Male",
    emergencyContact: "+91 99223 99887 (Brother)",
    allergies: "Sulfa drugs",
    address: "12, Shanti Nagar, Ahmedabad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt_101",
    patientId: "pat_1",
    patientName: "Rahul Sharma",
    patientPhone: "+91 98765 43210",
    doctorId: "doc_1",
    doctorName: "Dr. Rajesh Sharma",
    doctorEmail: "dr.rajesh@aurahealth.com",
    department: "Cardiology",
    date: "2026-10-08",
    time: "10:30 AM",
    status: "Confirmed",
    symptoms: "Mild chest tightness after climbing stairs, occasional breathlessness",
    fee: 800,
    paymentStatus: "Paid",
    notes: "Patient advised to bring past ECG report and fast for lipid profile."
  },
  {
    id: "apt_102",
    patientId: "pat_2",
    patientName: "Pooja Verma",
    patientPhone: "+91 98111 22334",
    doctorId: "doc_5",
    doctorName: "Dr. Neha Kapoor",
    doctorEmail: "dr.neha@aurahealth.com",
    department: "Dermatology",
    date: "2026-10-09",
    time: "03:00 PM",
    status: "Confirmed",
    symptoms: "Facial acne flare-up and dry skin allergy during weather change",
    fee: 650,
    paymentStatus: "Paid",
    notes: "Reviewing skin barrier restoration regimen."
  },
  {
    id: "apt_103",
    patientId: "pat_1",
    patientName: "Rahul Sharma",
    patientPhone: "+91 98765 43210",
    doctorId: "doc_6",
    doctorName: "Dr. Amitav Roy",
    doctorEmail: "dr.amitav@aurahealth.com",
    department: "General Medicine",
    date: "2026-09-25",
    time: "11:00 AM",
    status: "Completed",
    symptoms: "Viral fever, body aches and throat irritation",
    fee: 500,
    paymentStatus: "Paid",
    prescription: "Paracetamol 650mg TDS x 3 days, Vitamin C 500mg OD x 7 days, Warm salt water gargles.",
    notes: "Patient fully recovered, vitals stabilized."
  },
  {
    id: "apt_104",
    patientId: "pat_3",
    patientName: "Amit Patel",
    patientPhone: "+91 99223 34455",
    doctorId: "doc_4",
    doctorName: "Dr. Vikram Malhotra",
    doctorEmail: "dr.vikram@aurahealth.com",
    department: "Orthopedics",
    date: "2026-10-10",
    time: "09:30 AM",
    status: "Pending",
    symptoms: "Right knee pain when walking downhill",
    fee: 750,
    paymentStatus: "Pending",
    notes: "Awaiting administrative slot confirmation."
  }
];

export const INITIAL_MEDICAL_RECORDS = [
  {
    id: "rec_1",
    patientId: "pat_1",
    patientName: "Rahul Sharma",
    doctorName: "Dr. Amitav Roy",
    date: "2026-09-25",
    diagnosis: "Acute Viral Upper Respiratory Infection",
    vitals: {
      bp: "122/80 mmHg",
      pulse: "76 bpm",
      temp: "99.2 °F",
      sugar: "98 mg/dL (Random)",
      spo2: "99%"
    },
    prescription: "1. Tab Dolo 650mg (1-0-1 after food x 3 days)\n2. Tab Cetirizine 10mg (0-0-1 at bedtime x 5 days)\n3. Lozenges as needed",
    labReportTitle: "CBC & Routine Blood Panel",
    labReportUrl: "#",
    notes: "Hydration maintained. Advised rest for 2 days."
  },
  {
    id: "rec_2",
    patientId: "pat_1",
    patientName: "Rahul Sharma",
    doctorName: "Dr. Rajesh Sharma",
    date: "2026-08-14",
    diagnosis: "Pre-Hypertension Assessment & Baseline Cardiac Profile",
    vitals: {
      bp: "135/88 mmHg",
      pulse: "82 bpm",
      temp: "98.6 °F",
      sugar: "112 mg/dL (Fasting)",
      spo2: "98%"
    },
    prescription: "1. Tab Telmisartan 20mg (1-0-0 morning after breakfast)\n2. Dietary DASH regimen advised (Low salt, high potassium).",
    labReportTitle: "Lipid Profile & 12-Lead ECG Report",
    labReportUrl: "#",
    notes: "Total Cholesterol: 195 mg/dL (Borderline), Triglycerides: 160 mg/dL."
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev_1",
    doctorId: "doc_1",
    doctorName: "Dr. Rajesh Sharma",
    patientName: "Rahul Sharma",
    rating: 5,
    date: "2026-09-26",
    comment: "Dr. Rajesh is exceptionally thorough. He explained my ECG and blood pressure readings in great detail and helped me understand preventive lifestyle changes."
  },
  {
    id: "rev_2",
    doctorId: "doc_5",
    doctorName: "Dr. Neha Kapoor",
    patientName: "Pooja Verma",
    rating: 5,
    date: "2026-09-15",
    comment: "Best dermatologist in town! Within 2 weeks of following her prescribed routine, my skin redness disappeared completely. Very empathetic doctor."
  },
  {
    id: "rev_3",
    doctorId: "doc_2",
    doctorName: "Dr. Ananya Sen",
    patientName: "Sunil K.",
    rating: 5,
    date: "2026-09-10",
    comment: "Dr. Ananya helped diagnose my chronic migraine triggers accurately. The staff and digital records system at AuraHealth made everything so effortless!"
  }
];

export const INITIAL_SETTINGS = {
  hospitalName: "AuraHealth Multi-Specialty Hospital & Research Institute",
  tagline: "Empowering Lives with Next-Generation AI Healthcare",
  emergencyPhone: "1800-AURA-911 (+91 11 4567 8900)",
  contactEmail: "care@aurahealth.org",
  address: "Sector 62, Institutional Area, HealthTech Corridor, New Delhi, India",
  operatingHours: "OPD: 08:00 AM - 08:00 PM | Emergency: 24 Hours / 7 Days",
  enableAiAssistant: true,
  autoApproveAppointments: false,
  notificationAlerts: true,
  maxDailySlotsPerDoctor: 25,
  telehealthEnabled: true,
  maintenanceMode: false
};
