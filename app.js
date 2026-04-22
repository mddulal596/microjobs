import { auth, db } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, onValue, set, get, update, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let userUID = null;
let currentTask = null;

// Notification Helper
const toast = (msg, color = "#3b82f6") => {
    Toastify({ text: msg, duration: 3000, gravity: "top", position: "center", backgroundColor: color }).showToast();
};

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        userUID = user.uid;
        document.getElementById('auth-screen').classList.add('hidden');
        syncData();
        loadTasks();
    } else {
        document.getElementById('auth-screen').classList.remove('hidden');
    }
});

// Login & Signup
document.getElementById('login-btn').onclick = () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, e, p).catch(err => toast(err.message, "#ef4444"));
};

document.getElementById('signup-btn').onclick = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, e, p);
        await set(ref(db, `users/${res.user.uid}`), {
            email: e, balance: 0, pending: 0, completed: {}
        });
        toast("Account Created!", "#10b981");
    } catch (err) { toast(err.message, "#ef4444"); }
};

document.getElementById('logout-trigger').onclick = () => signOut(auth);

// --- Sync User Data ---
function syncData() {
    onValue(ref(db, `users/${userUID}`), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        const bal = `$${(data.balance || 0).toFixed(2)}`;
        const pen = `$${(data.pending || 0).toFixed(2)}`;
        document.getElementById('header-balance').innerText = bal;
        document.getElementById('main-balance').innerText = bal;
        document.getElementById('pending-balance').innerText = pen;
    });
}

// --- Task System ---
function loadTasks() {
    onValue(ref(db, 'tasks'), (snapshot) => {
        const tasks = snapshot.val();
        const list = document.getElementById('task-list');
        list.innerHTML = "";
        for (let id in tasks) {
            const t = tasks[id];
            const div = document.createElement('div');
            div.className = "bg-gray-900 p-5 rounded-2xl border border-gray-800 flex justify-between items-center";
            div.innerHTML = `
                <div>
                    <h4 class="font-bold">${t.title}</h4>
                    <p class="text-xs text-blue-400 font-medium">${t.type}</p>
                </div>
                <button onclick="openTask('${id}')" class="bg-blue-600/10 text-blue-500 px-4 py-2 rounded-xl border border-blue-500/20 font-bold text-sm">Earn $${t.reward}</button>
            `;
            list.appendChild(div);
        }
    });
}

window.openTask = async (id) => {
    const snap = await get(ref(db, `tasks/${id}`));
    currentTask = { ...snap.val(), id: id };
    document.getElementById('m-title').innerText = currentTask.title;
    document.getElementById('m-reward').innerText = `Reward: $${currentTask.reward}`;
    document.getElementById('m-instr').innerText = currentTask.instructions;
    document.getElementById('task-modal').classList.remove('hidden');
};

window.closeTask = () => document.getElementById('task-modal').classList.add('hidden');

document.getElementById('submit-proof-btn').onclick = async () => {
    const proof = document.getElementById('proof-input').value;
    if (!proof) return toast("Please provide proof", "#f59e0b");

    const submission = {
        userId: userUID,
        userEmail: auth.currentUser.email,
        taskId: currentTask.id,
        reward: currentTask.reward,
        proof: proof,
        status: 'pending',
        timestamp: Date.now()
    };

    await push(ref(db, 'submissions'), submission);
    
    // Update pending balance
    const userRef = ref(db, `users/${userUID}`);
    const userSnap = await get(userRef);
    const userData = userSnap.val();
    await update(userRef, { pending: (userData.pending || 0) + parseFloat(currentTask.reward) });

    toast("Submitted! Wait for approval.", "#10b981");
    closeTask();
};
