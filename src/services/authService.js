import { googleSignIn, commonSignOut } from "../firebase/authRepository";

export const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
};

export const signIn = async () => {
    const loggedUser = await googleSignIn();
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
};

export const signOut = async () => {
    await commonSignOut();
    localStorage.removeItem("user");
    return true;
};