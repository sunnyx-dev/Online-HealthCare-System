// AuraHealth Firebase Configuration & Credentials
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDwv5cvADP1vfiKFML4--8QoBxiOZvijKg",
  authDomain: "aurahealth-e16a4.firebaseapp.com",
  projectId: "aurahealth-e16a4",
  storageBucket: "aurahealth-e16a4.firebasestorage.app",
  messagingSenderId: "90273695052",
  appId: "1:90273695052:web:fb3b5e40c6ec2e36683be9",
  measurementId: "G-BMCSMR52RR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
