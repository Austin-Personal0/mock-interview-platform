// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_-gfhVTArf-egOpVQhKqIjP1WpkJB01E",
  authDomain: "prepwise-interviews-73ee8.firebaseapp.com",
  projectId: "prepwise-interviews-73ee8",
  storageBucket: "prepwise-interviews-73ee8.firebasestorage.app",
  messagingSenderId: "617882393657",
  appId: "1:617882393657:web:3f6d21b07c48bbfdde81e8",
  measurementId: "G-E325E68D01"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getAuth();
export const db = getFirestore(app as FirebaseApp);
export const auth = getAuth(app as FirebaseApp);