import { auth, db } from './firebase.js';
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
ref, set, get, push, update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Register
window.register = async () => {
 let email=emailInput.value;
 let pass=passwordInput.value;

 let user=await createUserWithEmailAndPassword(auth,email,pass);

 await set(ref(db,'users/'+user.user.uid),{
   balance:0,
   pending:0
 });

 alert("Registered");
}

// Login
window.login = ()=>{
 signInWithEmailAndPassword(auth,emailInput.value,passwordInput.value);
}

// Load Tasks
window.loadTasks = async ()=>{
 let snap=await get(ref(db,'tasks'));
 let html='';
 snap.forEach(t=>{
   let d=t.val();
   html+=`
   <div class="card">
     <h3>${d.title}</h3>
     <p>${d.reward} ৳</p>
     <input placeholder="Proof Link" id="p${t.key}">
     <button onclick="submitTask('${t.key}',${d.reward})">Submit</button>
   </div>`;
 });
 tasks.innerHTML=html;
}

// Submit Task
window.submitTask = async (taskId,reward)=>{
 let user=auth.currentUser;
 let proof=document.getElementById('p'+taskId).value;

 // Anti-cheat
 let check=await get(ref(db,'submissions'));
 let exists=false;
 check.forEach(s=>{
   let v=s.val();
   if(v.uid===user.uid && v.taskId===taskId){
     exists=true;
   }
 });
 if(exists){
   alert("Already submitted");
   return;
 }

 await push(ref(db,'submissions'),{
   uid:user.uid,
   taskId:taskId,
   proof:proof,
   reward:reward,
   status:"pending"
 });

 alert("Submitted");
}

// Withdraw
window.withdraw = async ()=>{
 let user=auth.currentUser;
 let amount=prompt("Amount");

 await push(ref(db,'withdrawals'),{
   uid:user.uid,
   amount:amount,
   status:"pending"
 });

 alert("Request sent");
}

// Auth State
onAuthStateChanged(auth,user=>{
 if(user){
   authBox.style.display="none";
   dashboard.style.display="block";
   loadTasks();
 }
});
