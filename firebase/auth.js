// firebase/auth.js
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

export function observeAuthState(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    callback({ uid: user.uid, ...docSnap.data() });
                } else {
                    const defaultData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || "User",
                        photoURL: user.photoURL || "",
                        balances: {
                            main: 0,
                            deposit: 0,
                            pending: 0,
                            bonus: 0,
                            referral: 0
                        },
                        createdAt: serverTimestamp()
                    };
                    await setDoc(docRef, defaultData);
                    callback(defaultData);
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
                callback({ uid: user.uid, email: user.email });
            }
        } else {
            callback(null);
        }
    });
}

export async function loginWithEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    if (displayName) {
        await updateProfile(user, { displayName });
    }
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "User",
        photoURL: "",
        balances: {
            main: 0,
            deposit: 0,
            pending: 0,
            bonus: 0,
            referral: 0
        },
        createdAt: serverTimestamp()
    });
    return user;
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "User",
            photoURL: user.photoURL || "",
            balances: {
                main: 0,
                deposit: 0,
                pending: 0,
                bonus: 0,
                referral: 0
            },
            createdAt: serverTimestamp()
        });
    }
    return user;
}

export async function logoutUser() {
    return await signOut(auth);
}
