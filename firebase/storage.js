import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

export async function uploadFile(file, path) {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
