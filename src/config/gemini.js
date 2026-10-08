import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiConfig, isGeminiConfigured } from "./apiConfig";

// Built-in intelligent AI healthcare advisor for AuraHealth
export const queryAuraAi = async (userMessage, doctorsList = [], appointmentsList = []) => {
  const config = getApiConfig();
  
  // Format doctors context for AI
  const doctorsContext = doctorsList.map(doc => 
    `- Dr. ${doc.name} (${doc.specialty}), Exp: ${doc.experience}, Fee: ₹${doc.fee}, Timings: ${doc.timings}, Days: ${doc.availableDays?.join(', ') || 'Mon-Sat'}, Rating: ⭐${doc.rating}`
  ).join('\n');

  const systemInstruction = `
You are 'Aura AI', a friendly, highly intelligent, and compassionate medical AI assistant for the AuraHealth Hospital Management System.
You can understand and respond fluently in the user's language (Hindi, Hinglish, English, etc.).

Hospital Specialist Doctors Database:
${doctorsContext}

Your Responsibilities:
1. SYMPTOM ANALYSIS & DOCTOR RECOMMENDATION:
   - When the user describes symptoms in their own words (e.g., "mujhe kal se chest pain aur breathing issue ho rha hai", "sir me dard hai", "skin rash problem"):
   - Calmly analyze the symptoms, provide supportive first-aid/cautionary advice.
   - Match and recommend the SPECIFIC doctor(s) from the AuraHealth database above by name and specialty!
   - Highlight the doctor's name, consultation fee, and available timings.

2. DOCTOR SCHEDULE & TIMING INQUIRIES:
   - When user asks who is free when or timing of a specific doctor (e.g. "Dr. Ananya kab khali hain?", "cardiologist kab milenge?"):
   - Look up the exact doctor in the list and provide clear timing, available days, and advise them to book via the Patient Dashboard.

3. MEDICAL REPORT & LAB VALUES INTERPRETATION:
   - When user asks about lab reports or numbers (e.g. "BP 140/95", "Sugar 180 fasting", "HbA1c 7.2", "Hemoglobin 10.5"):
   - Explain clearly in simple, reassuring Hindi/English what the test means, normal vs reported values, possible reasons, dietary advice, and recommend consulting the appropriate specialist doctor.

4. SAFETY & TONE:
   - Always be empathetic, polite, clear, and structured with bullet points.
   - Include a brief medical disclaimer that this is AI guidance and in emergency situations they should call AuraHealth Emergency (1800-AURA-911) or visit the ER immediately.
`;

  // 1. If Gemini API Key is provided by user, use Google Generative AI
  if (isGeminiConfigured() && config.gemini.apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction 
      });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      return {
        text: response.text(),
        source: "gemini-live"
      };
    } catch (error) {
      console.warn("Gemini API live call error, falling back to smart engine:", error);
    }
  }

  // 2. High-Quality Smart Local Medical Knowledge Engine (Fallback when key not yet entered)
  const lower = userMessage.toLowerCase();
  
  // Timing / Schedule Query
  for (const doc of doctorsList) {
    const docName = doc.name.toLowerCase();
    if (lower.includes(docName) || (lower.includes(doc.specialty.toLowerCase()) && (lower.includes('timing') || lower.includes('khali') || lower.includes('free') || lower.includes('time') || lower.includes('available') || lower.includes('kab')))) {
      return {
        text: `🩺 **Dr. ${doc.name} (${doc.specialty}) Ki Timing & Availability:**\n\n` +
              `• **Available Days:** ${doc.availableDays?.join(', ') || 'Monday se Saturday'}\n` +
              `• **OPD Timings:** ${doc.timings || '10:00 AM - 04:00 PM'}\n` +
              `• **Consultation Fee:** ₹${doc.fee}\n` +
              `• **Experience & Rating:** ${doc.experience} (⭐ ${doc.rating}/5.0)\n\n` +
              `💡 **Kaise Book Karein:** Aap Patient Dashboard me jaakar **'Book Appointment'** section se apni pasandida slot choose karke book kar sakte hain!`,
        source: "aura-smart-engine"
      };
    }
  }

  // Medical Report Query
  if (lower.includes('report') || lower.includes('sugar') || lower.includes('bp') || lower.includes('blood pressure') || lower.includes('hba1c') || lower.includes('hemoglobin') || lower.includes('cholesterol') || lower.includes('ecg') || lower.includes('mri')) {
    let reportAnalysis = "";
    if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('hba1c')) {
      reportAnalysis = `🩸 **Diabetes & Blood Sugar Report Analysis:**\n\n` +
        `• **Normal Fasting:** 70 - 99 mg/dL (100-125 is Pre-diabetes, >126 indicates Diabetes).\n` +
        `• **Normal Post-Meal (PP):** < 140 mg/dL.\n` +
        `• **HbA1c Target:** Normal is < 5.7%. If 5.7% - 6.4% (Pre-diabetic), > 6.5% (Diabetic).\n` +
        `• **Guidance:** Meetha aur refined carbs kam karein, daily 30 min walk karein, aur hydration maintain rakhein.`;
    } else if (lower.includes('bp') || lower.includes('blood pressure')) {
      reportAnalysis = `💓 **Blood Pressure (BP) Report Analysis:**\n\n` +
        `• **Ideal BP:** 120/80 mmHg.\n` +
        `• **Elevated / High BP:** Systolic > 130 ya Diastolic > 85 mmHg.\n` +
        `• **Guidance:** Namak (sodium) ka sewan kam karein, stress manage karein aur deep breathing exercises karein.`;
    } else {
      reportAnalysis = `📋 **Medical Report Interpretation:**\n\n` +
        `• Aapki report parameters ko dhyan me rakhte hue, kisi bhi abnormal value ke liye self-medication na karein.\n` +
        `• Regular hydration, balanced fiber-rich diet aur proper sleep healing me madad karta hai.`;
    }

    const cardioDoc = doctorsList.find(d => d.specialty.includes('Cardio') || d.specialty.includes('General') || d.specialty.includes('Medicine')) || doctorsList[0];

    return {
      text: `${reportAnalysis}\n\n` +
            `👨‍⚕️ **Recommended Specialist in AuraHealth:**\n` +
            `• **Dr. ${cardioDoc?.name || 'Priya Sharma'}** (${cardioDoc?.specialty || 'General Medicine'})\n` +
            `• **Timing:** ${cardioDoc?.timings || '10:00 AM - 04:00 PM'}\n\n` +
            `*Disclaimer: Yeh AI guidance hai. Kripya apne doctor se prescription review zaroor karayein.*`,
      source: "aura-smart-engine"
    };
  }

  // Symptom to Department & Doctor Mapping
  let matchedSpecialty = "General Physician";
  let analysisSummary = "";

  if (lower.includes('heart') || lower.includes('chest') || lower.includes('chhati') || lower.includes('dharkan') || lower.includes('palpitation') || lower.includes('blood pressure')) {
    matchedSpecialty = "Cardiology";
    analysisSummary = "Chest pain, palpitations ya heart se related takleef me turant Cardiologist ko consult karna chahiye.";
  } else if (lower.includes('brain') || lower.includes('headache') || lower.includes('sir dard') || lower.includes('chakkar') || lower.includes('dizzy') || lower.includes('migraine') || lower.includes('nerve')) {
    matchedSpecialty = "Neurology";
    analysisSummary = "Frequent sir dard, migraine ya chakkar aane par Neurologist se consultation recommended hai.";
  } else if (lower.includes('child') || lower.includes('bachha') || lower.includes('baby') || lower.includes('kid') || lower.includes('teeka') || lower.includes('vaccination')) {
    matchedSpecialty = "Pediatrics";
    analysisSummary = "Bachhon ki kisi bhi bimari ya vaccination ke liye Pediatrician sabse best guidance dete hain.";
  } else if (lower.includes('bone') || lower.includes('haddi') || lower.includes('joint') || lower.includes('knee') || lower.includes('ghutna') || lower.includes('back pain') || lower.includes('kamar')) {
    matchedSpecialty = "Orthopedics";
    analysisSummary = "Jodon ka dard, haddiyon ki chot ya back pain ke liye Orthopedic specialist ko dikhana zaroori hai.";
  } else if (lower.includes('skin') || lower.includes('khujli') || lower.includes('rash') || lower.includes('acne') || lower.includes('pimples') || lower.includes('chehra') || lower.includes('hair')) {
    matchedSpecialty = "Dermatology";
    analysisSummary = "Skin allergies, pimples ya hair fall ke liye Dermatologist sahi treatment prescribe karte hain.";
  } else if (lower.includes('eye') || lower.includes('aankh') || lower.includes('vision') || lower.includes('chashma') || lower.includes('dhundhla')) {
    matchedSpecialty = "Ophthalmology";
    analysisSummary = "Aankhon me jalan ya kam dikhne par Eye Specialist (Ophthalmologist) ko check karwayen.";
  } else if (lower.includes('teeth') || lower.includes('daant') || lower.includes('gums') || lower.includes('maseede') || lower.includes('cavity')) {
    matchedSpecialty = "Dentistry";
    analysisSummary = "Daant ke dard ya cavity ke liye Dental expert se treatment lena chahiye.";
  } else {
    matchedSpecialty = "General Medicine";
    analysisSummary = "Bukhar, sardi-khasi ya general weakness ke liye General Physician se initial checkup best rehta hai.";
  }

  // Find suitable doctor from hospital database
  const recDoc = doctorsList.find(d => d.specialty.toLowerCase().includes(matchedSpecialty.toLowerCase())) || doctorsList[0];

  return {
    text: `Namaste! Maine aapki symptoms ko dhyan se analyze kiya hai:\n\n` +
          `🔍 **Symptom Assessment:**\n` +
          `• ${analysisSummary}\n` +
          `• **Department:** ${matchedSpecialty}\n\n` +
          `👨‍⚕️ **AuraHealth Doctor Recommendation:**\n` +
          `• **Doctor:** Dr. ${recDoc?.name || 'Aarav Mehta'}\n` +
          `• **Specialty:** ${recDoc?.specialty || matchedSpecialty}\n` +
          `• **Experience:** ${recDoc?.experience || '12+ Years'}\n` +
          `• **OPD Timings:** ${recDoc?.timings || '10:00 AM - 05:00 PM'}\n` +
          `• **Consultation Fee:** ₹${recDoc?.fee || 600} (⭐ ${recDoc?.rating || 4.9})\n\n` +
          `📅 **Next Step:** Aap **Patient Dashboard > Book Appointment** par click karke Dr. ${recDoc?.name} ke sath slot select kar sakte hain!\n\n` +
          `*Agar emergency hai to turant hamari 24x7 Emergency Line: 1800-AURA-911 par call karein.*`,
    source: "aura-smart-engine"
  };
};
