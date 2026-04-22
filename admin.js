import { db } from './firebase.js';
import { ref, push, set, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Add Task
document.getElementById('add-task-btn').onclick = async () => {
    const taskData = {
        title: document.getElementById('t-title').value,
        reward: parseFloat(document.getElementById('t-reward').value),
        type: document.getElementById('t-type').value,
        instructions: document.getElementById('t-desc').value,
        proofRequirement: document.getElementById('t-proof').value
    };
    await push(ref(db, 'tasks'), taskData);
    alert("Task Added");
};

// Load Submissions
onValue(ref(db, 'submissions'), (snapshot) => {
    const subs = snapshot.val();
    const container = document.getElementById('admin-subs');
    container.innerHTML = "";
    for (let id in subs) {
        if (subs[id].status === 'pending') {
            const s = subs[id];
            container.innerHTML += `
                <div class="bg-gray-800 p-4 border border-gray-700 rounded">
                    <p><strong>User:</strong> ${s.userEmail}</p>
                    <p><strong>Task:</strong> ${s.taskTitle}</p>
                    <p><strong>Proof:</strong> ${s.proof}</p>
                    <div class="mt-2 flex gap-2">
                        <button onclick="approveSub('${id}')" class="bg-green-600 px-4 py-1 rounded">Approve</button>
                        <button onclick="rejectSub('${id}')" class="bg-red-600 px-4 py-1 rounded">Reject</button>
                    </div>
                </div>
            `;
        }
    }
});

window.approveSub = async (id) => {
    const subSnap = await get(ref(db, `submissions/${id}`));
    const sub = subSnap.val();
    const userRef = ref(db, `users/${sub.userId}`);
    const userSnap = await get(userRef);
    const user = userSnap.val();

    // Logic: Move from pending to balance
    await update(userRef, {
        balance: (user.balance || 0) + parseFloat(sub.reward),
        pending: (user.pending || 0) - parseFloat(sub.reward)
    });
    
    await update(ref(db, `submissions/${id}`), { status: 'approved' });
    alert("Approved & Paid!");
};

window.rejectSub = async (id) => {
    const subSnap = await get(ref(db, `submissions/${id}`));
    const sub = subSnap.val();
    const userRef = ref(db, `users/${sub.userId}`);
    const userSnap = await get(userRef);
    const user = userSnap.val();

    await update(userRef, {
        pending: Math.max(0, (user.pending || 0) - parseFloat(sub.reward))
    });

    await update(ref(db, `submissions/${id}`), { status: 'rejected' });
    alert("Submission Rejected");
};
