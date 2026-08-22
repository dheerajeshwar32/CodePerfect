import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with the keys Firebase gave you in Step 1
const firebaseConfig = {
  apiKey: "AIzaSyCYwcIjRMnjnqcGgCP1t0PEDxdx8KKIGZk",
  authDomain: "codeperfect-kyc.firebaseapp.com",
  projectId: "codeperfect-kyc",
  storageBucket: "codeperfect-kyc.firebasestorage.app",
  messagingSenderId: "41260533878",
  appId: "1:41260533878:web:64d2e05d905fd98c707757",
  measurementId: "G-9XS9CTGS28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Database for use in other components
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);