import { db } from '../config'
import { doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, collection } from "firebase/firestore";

export const createUser = async (user, role = "student") => {
    try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: role,
            lastLogin: Timestamp.fromDate(new Date(user.metadata.lastSignInTime)),
        });
    } catch (error) {
        console.error("Error adding user to Firestore:", error);
        throw error;
    }
};

export const readUser = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            throw new Error(`User with ID ${userId} does not exist.`);
        }
    } catch (error) {
        console.error("Error reading user from Firestore:", error);
        throw error;
    }
};

export const updateUser = async (userId, updatedFields) => {
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, updatedFields);
        console.log(`User with ID ${userId} updated successfully.`);
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        await deleteDoc(userDocRef);
        console.log(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting user from Firestore:", error);
        throw error;
    }
};

export const queryUserByField = async (field, value) => {
    try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where(field, "==", value));
        const querySnapshot = await getDocs(userQuery);
    
        if (querySnapshot.empty) {
            throw new Error(`No user found with ${field} equal to ${value}`);
        }
    
        const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error querying user by field:", error);
        throw error;
    }
};