import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function registerUser(email, password, name, referralCode) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: email,
    displayName: name,
    role: "worker",
    balances: { main: 0, pending: 0, bonus: 0, referral: 0 },
    level: 1,
    streak: 1,
    createdAt: new Date().toISOString()
  });
  return user;
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: "worker",
      balances: { main: 0, pending: 0, bonus: 0, referral: 0 },
      level: 1,
      streak: 1,
      createdAt: new Date().toISOString()
    });
  }
  return user;
}

export async function logoutUser() {
  return await signOut(auth);
}

export async function resetPassword(email) {
  return await sendPasswordResetEmail(auth, email);
}

export function observeAuthState(callback) {
  onAuthStateChanged(auth, callback);
}
