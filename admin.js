import { db } from './firebase.js';
import {
ref, push, onValue, update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Add Task
window.addTask = ()=>{
 push(ref(db,'tasks'),{
   title:title.value,
   reward:reward.value
 });
}

// Load Submissions
onValue(ref(db,'submissions'),snap=>{
 let html='';
 snap.forEach(s=>{
   let d=s.val();
   html+=`
   <div class="card">
   ${d.proof} - ${d.reward}
   <button onclick="approve('${s.key}','${d.uid}',${d.reward})">Approve</button>
   </div>`;
 });
 subs.innerHTML=html;
});

// Approve
window.approve = async (id,uid,reward)=>{
 await update(ref(db,'submissions/'+id),{
   status:"approved"
 });

 let userRef=ref(db,'users/'+uid);
 let snap=await get(userRef);
 let bal=snap.val().balance||0;

 await update(userRef,{
   balance:bal + parseInt(reward)
 });
}
