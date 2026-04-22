import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-Oa4ZWgGA3TrQFRUrEz3Y8CXkYd4hmyM",
  authDomain: "microjobs-13730.firebaseapp.com",
  databaseURL: "https://microjobs-13730-default-rtdb.firebaseio.com",
  projectId: "microjobs-13730",
  storageBucket: "microjobs-13730.firebasestorage.app",
  messagingSenderId: "288652584372",
  appId: "1:288652584372:web:331a3867f481ffe91bfee1",
  measurementId: "G-VXYSNKCSYD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
