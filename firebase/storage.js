// firebase/storage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { storage } from './firebase-config.js';

export async function uploadTaskProofImage(file, userId) {
    try {
        const timestamp = Date.now();
        const filePath = `proofs/${userId}_${timestamp}_${file.name}`;
        const storageRef = ref(storage, filePath);
        
        // ফাইল আপলোড
        const snapshot = await uploadBytes(storageRef, file);
        // ডাউনলোড ইউআরএল জেনারেট
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
