import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getApiConfig, isFirebaseConfigured } from "./apiConfig";

let app = null;
let auth = null;
let googleProvider = null;
let analytics = null;

export const initFirebase = () => {
  const config = getApiConfig();
  if (isFirebaseConfigured()) {
    try {
      app = getApps().length === 0 ? initializeApp(config.firebase) : getApp();
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      
      // Initialize analytics safely if in browser environment
      if (typeof window !== 'undefined') {
        isSupported().then(yes => {
          if (yes) {
            analytics = getAnalytics(app);
            console.log("📊 Firebase Analytics initialized.");
          }
        }).catch(() => {});
      }

      console.log("🔥 Firebase initialized successfully with active credentials!");
      return { app, auth, googleProvider, analytics, isLive: true };
    } catch (error) {
      console.warn("⚠️ Firebase init warning:", error.message);
    }
  }
  return { app: null, auth: null, googleProvider: null, analytics: null, isLive: false };
};

// Initialize on load
initFirebase();

export { app, auth, googleProvider, analytics };

// Google Sign-In helper with graceful fallback
export const loginWithGoogleFirebase = async () => {
  const { auth: currentAuth, googleProvider: provider, isLive } = initFirebase();
  
  if (isLive && currentAuth && provider) {
    try {
      const result = await signInWithPopup(currentAuth, provider);
      const user = result.user;
      return {
        success: true,
        user: {
          id: user.uid,
          name: user.displayName || "Google User",
          email: user.email,
          role: "patient",
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          authProvider: "google-firebase"
        }
      };
    } catch (err) {
      console.error("Firebase Google Auth error:", err);
      throw new Error(err.message || "Google Authentication failed");
    }
  }

  // Graceful simulated Google sign-in if Firebase keys are pending
  return {
    success: true,
    simulated: true,
    user: {
      id: `google_${Date.now()}`,
      name: "Rahul Sharma (Google Demo)",
      email: "rahul.sharma@example.com",
      role: "patient",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      authProvider: "google-simulated"
    }
  };
};
