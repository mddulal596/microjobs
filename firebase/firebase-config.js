import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-Oa4ZWgGA3TrQFRUrEz3Y8CXkYd4hmyM",
  authDomain: "microjobs-13730.firebaseapp.com",
  projectId: "microjobs-13730",
  storageBucket: "microjobs-13730.firebasestorage.app",
  messagingSenderId: "288652584372",
  appId: "1:288652584372:web:331a3867f481ffe91bfee1",
  measurementId: "G-VXYSNKCSYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
