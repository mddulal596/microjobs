import { db } from './firebase.js';
import { ref, onValue, update, get, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Load Submissions
onValue(ref(db, 'submissions'), (snapshot) => {
    const subs = snapshot.val();
    const container = document.getElementById('admin-subs');
    if(!container) return; 
    container.innerHTML = "";
    for (let id in subs) {
        if (subs[id].status === 'pending') {
            const s = subs[id];
            const div = document.createElement('div');
            div.className = "bg-gray-800 p-4 rounded mb-2";
            div.innerHTML = `
                <p>Email: ${s.userEmail}</p>
                <p>Proof: ${s.proof}</p>
                <button onclick="approve('${id}')" class="bg-green-600 px-4 py-1 rounded mt-2">Approve</button>
            `;
            container.appendChild(div);
        }
    }
});

window.approve = async (subId) => {
    const subSnap = await get(ref(db, `submissions/${subId}`));
    const s = subSnap.val();
    
    const userRef = ref(db, `users/${s.userId}`);
    const uSnap = await get(userRef);
    const u = uSnap.val();

    await update(userRef, {
        balance: (u.balance || 0) + parseFloat(s.reward),
        pending: (u.pending || 0) - parseFloat(s.reward)
    });

    await update(ref(db, `submissions/${subId}`), { status: 'approved' });
    alert("Approved!");
};
