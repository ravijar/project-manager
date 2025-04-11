import {googleSignIn, commonSignOut} from "../firebase/auth";
import {createUser, readUser} from "../firebase/firestore/userStore";

export const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
};

export const signIn = async (selectedRole) => {
    console.log(selectedRole);
    const loggedUser = await googleSignIn();
    let user = null;
    try {
        user = await readUser(loggedUser.uid);
    } catch (error) {
        console.warn("Registering user:", error);
    }
    if (!user) {
        await createUser(loggedUser, selectedRole);
        loggedUser.role = selectedRole;
    } else {
        loggedUser.role = user.role;
    }
    ;

    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
};

export const signOut = async () => {
    await commonSignOut();
    localStorage.removeItem("user");
    return true;
};