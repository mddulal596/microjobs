import { auth, db } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, onValue, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const authModal = document.getElementById('auth-modal');
const loader = document.getElementById('loader');

// --- Helpers ---
const showToast = (msg, color = "#3b82f6") => {
    Toastify({ text: msg, backgroundColor: color, position: "center" }).showToast();
};

// --- Auth Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        authModal.classList.add('hidden');
        document.getElementById('user-email').innerText = user.email;
        syncUserData(user.uid);
        fetchTasks();
    } else {
        authModal.classList.remove('hidden');
    }
});

// --- Sync Balance ---
function syncUserData(uid) {
    onValue(ref(db, `users/${uid}`), (snap) => {
        const data = snap.val();
        if (data) {
            document.getElementById('top-balance').innerText = `$${data.balance.toFixed(2)}`;
            document.getElementById('stat-balance').innerText = `$${data.balance.toFixed(2)}`;
            document.getElementById('stat-pending').innerText = `$${data.pending.toFixed(2)}`;
        }
    });
}

// --- Fetch Jobs ---
function fetchTasks() {
    onValue(ref(db, 'tasks'), (snap) => {
        const tasks = snap.val();
        const container = document.getElementById('task-list');
        container.innerHTML = "";
        
        if (!tasks) {
            container.innerHTML = "<p class='text-center text-gray-500 mt-10'>No jobs available right now.</p>";
            return;
        }

        for (let id in tasks) {
            const t = tasks[id];
            container.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex justify-between items-center hover:scale-[1.02] transition transform">
                    <div>
                        <h4 class="font-bold text-gray-100">${t.title}</h4>
                        <p class="text-xs text-gray-400">${t.type}</p>
                    </div>
                    <button onclick="alert('Submit proof for: ${t.title}')" class="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg font-bold text-sm border border-blue-500/30">
                        Earn $${t.reward}
                    </button>
                </div>
            `;
        }
    });
}

// --- Login/Signup Actions ---
document.getElementById('login-btn').onclick = async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    loader.classList.remove('hidden');
    try {
        await signInWithEmailAndPassword(auth, e, p);
        showToast("Welcome back!", "#10b981");
    } catch (err) {
        showToast(err.message, "#ef4444");
    }
    loader.classList.add('hidden');
};

document.getElementById('logout-btn').onclick = () => signOut(auth);
