import { auth } from "../config";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

export const commonSignOut = async () => {
    await signOut(auth);
};