import { googleSignIn, commonSignOut } from "../firebase/auth";
import { createUser, readUser } from "../firebase/firestore/userStore";

export const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
};

export const signIn = async () => {
    const loggedUser = await googleSignIn();
    const user = await readUser(loggedUser.uid);

    if (!user) {
        await createUser(loggedUser);
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    
    return loggedUser;
};

export const signOut = async () => {
    await commonSignOut();
    localStorage.removeItem("user");
    return true;
};