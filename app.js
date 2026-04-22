import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    ref, set, get, onValue, push, update 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// State
let currentUser = null;
let activeTaskId = null;

// UI Elements
const authSection = document.getElementById('auth-section');
const taskList = document.getElementById('task-list');
const taskModal = document.getElementById('task-modal');

// --- Auth Handling ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        authSection.classList.add('hidden');
        loadUserData();
        loadTasks();
    } else {
        authSection.classList.remove('hidden');
    }
});

document.getElementById('signup-btn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await set(ref(db, `users/${cred.user.uid}`), {
            email: email,
            balance: 0,
            pending: 0,
            completedTasks: {},
            referralCode: Math.random().toString(36).substring(7)
        });
    } catch (e) { alert(e.message); }
};

document.getElementById('login-btn').onclick = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password).catch(e => alert(e.message));
};

document.getElementById('logout-btn').onclick = () => signOut(auth);

// --- Data Fetching ---
function loadUserData() {
    onValue(ref(db, `users/${currentUser.uid}`), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        document.getElementById('user-balance').innerText = `$${data.balance.toFixed(2)}`;
        document.getElementById('stat-balance').innerText = `$${data.balance.toFixed(2)}`;
        document.getElementById('stat-pending').innerText = `$${data.pending.toFixed(2)}`;
    });
}

function loadTasks() {
    onValue(ref(db, 'tasks'), (snapshot) => {
        const tasks = snapshot.val();
        taskList.innerHTML = "";
        for (let id in tasks) {
            const t = tasks[id];
            taskList.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-blue-500 cursor-pointer" onclick="openTask('${id}')">
                    <div>
                        <h3 class="font-bold">${t.title}</h3>
                        <p class="text-xs text-gray-400">${t.type}</p>
                    </div>
                    <span class="text-blue-400 font-bold">$${t.reward}</span>
                </div>
            `;
        }
    });
}

// --- Task Submission ---
window.openTask = async (id) => {
    const snapshot = await get(ref(db, `tasks/${id}`));
    const task = snapshot.val();
    activeTaskId = id;
    
    document.getElementById('modal-title').innerText = task.title;
    document.getElementById('modal-reward').innerText = `Reward: $${task.reward}`;
    document.getElementById('modal-desc').innerText = task.instructions;
    document.getElementById('modal-proof-req').innerText = task.proofRequirement;
    taskModal.classList.remove('hidden');
};

window.closeModal = () => taskModal.classList.add('hidden');

document.getElementById('submit-task-btn').onclick = async () => {
    const proof = document.getElementById('proof-input').value;
    if (!proof) return alert("Proof is required");

    const submissionRef = push(ref(db, 'submissions'));
    const taskSnap = await get(ref(db, `tasks/${activeTaskId}`));
    const task = taskSnap.val();

    const submissionData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        taskId: activeTaskId,
        taskTitle: task.title,
        reward: task.reward,
        proof: proof,
        status: 'pending',
        timestamp: Date.now()
    };

    await set(submissionRef, submissionData);
    // Update user pending balance
    const userRef = ref(db, `users/${currentUser.uid}`);
    const userSnap = await get(userRef);
    const userData = userSnap.val();
    update(userRef, { pending: (userData.pending || 0) + parseFloat(task.reward) });

    alert("Task submitted! Awaiting approval.");
    closeModal();
};
