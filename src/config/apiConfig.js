// Central Secure Configuration for Firebase, Supabase, and Google Gemini API
// Keys are safely loaded from environment variables (import.meta.env) or Admin overrides

const STORAGE_KEY = 'aurahealth_api_keys_secure';

const getEnvConfig = () => ({
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aurahealth-e16a4.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aurahealth-e16a4",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aurahealth-e16a4.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "90273695052",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:90273695052:web:fb3b5e40c6ec2e36683be9",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BMCSMR52RR"
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://lfbffwsgreuedpdvhpmz.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ""
  }
});

export const getApiConfig = () => {
  const envConfig = getEnvConfig();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        firebase: { ...envConfig.firebase, ...(parsed.firebase || {}) },
        supabase: { ...envConfig.supabase, ...(parsed.supabase || {}) },
        gemini: { ...envConfig.gemini, ...(parsed.gemini || {}) }
      };
    }
  } catch (e) {
    console.error("Error reading secure config", e);
  }
  return envConfig;
};

export const saveApiConfig = (newConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    window.dispatchEvent(new Event('aura_keys_updated'));
    return true;
  } catch (e) {
    console.error("Error saving secure config", e);
    return false;
  }
};

export const isFirebaseConfigured = () => {
  const config = getApiConfig();
  return Boolean(config.firebase?.apiKey && config.firebase?.projectId);
};

export const isSupabaseConfigured = () => {
  const config = getApiConfig();
  return Boolean(config.supabase?.url && config.supabase?.anonKey);
};

export const isGeminiConfigured = () => {
  const config = getApiConfig();
  return Boolean(config.gemini?.apiKey);
};
