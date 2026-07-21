import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function createTask(taskData) {
  return await addDoc(collection(db, "tasks"), {
    ...taskData,
    remainingSlots: taskData.slots,
    status: "active",
    createdAt: new Date().toISOString()
  });
}

export async function getTasks() {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function submitTaskProof(submissionData) {
  return await addDoc(collection(db, "taskSubmissions"), {
    ...submissionData,
    status: "pending",
    submittedAt: new Date().toISOString()
  });
}

export async function requestWithdrawal(withdrawalData) {
  return await addDoc(collection(db, "withdrawals"), {
    ...withdrawalData,
    status: "pending",
    requestedAt: new Date().toISOString()
  });
}

export async function requestDeposit(depositData) {
  return await addDoc(collection(db, "deposits"), {
    ...depositData,
    status: "pending",
    timestamp: new Date().toISOString()
  });
}
