import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-Oa4ZWgGA3TrQFRUrEz3Y8CXkYd4hmyM",
  authDomain: "microjobs-13730.firebaseapp.com",
  databaseURL: "https://microjobs-13730-default-rtdb.firebaseio.com",
  projectId: "microjobs-13730",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
