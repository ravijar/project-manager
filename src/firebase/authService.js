import { auth, db } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: Timestamp.fromDate(new Date(user.metadata.lastSignInTime)),
    });

    return user;    
};

export const commonSignOut = async () => {
    await signOut(auth);
};