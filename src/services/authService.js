import {googleSignIn, commonSignOut} from "../firebase/auth";
import {createUser, readUser} from "../firebase/firestore/usersCollection.js";
import {RoleMismatchError} from "../errors/RoleMismatchError";

export const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
};

export const signIn = async (selectedRole) => {
    const loggedUser = await googleSignIn();
    let userFromStore = null;

    try {
        userFromStore = await readUser(loggedUser.uid);
    } catch (error) {
        console.warn("Registering new user:", error);
    }

    if (!userFromStore) {
        await createUser(loggedUser, selectedRole);
        userFromStore = await readUser(loggedUser.uid);
    } else if (userFromStore.role !== selectedRole) {
        throw new RoleMismatchError(selectedRole, userFromStore.role);
    }

    localStorage.setItem("user", JSON.stringify(userFromStore));
    return userFromStore;
};

export const signOut = async () => {
    await commonSignOut();
    localStorage.removeItem("user");
    return true;
};