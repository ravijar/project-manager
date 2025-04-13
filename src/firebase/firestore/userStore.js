import {db} from '../config';
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    Timestamp,
    collection
} from "firebase/firestore";
import {USER_ROLES as roles} from "../../services/userService";

const COLLECTION = "users";
const SUB_COLLECTION = "instances";

const getCurrentTimestamp = () => Timestamp.fromDate(new Date());
const getUserDocRef = (userId, role) => doc(db, `${COLLECTION}/${role}/${SUB_COLLECTION}`, userId);
const getUserCollectionRef = (role) => collection(db, `${COLLECTION}/${role}/${SUB_COLLECTION}`);

export const createUser = async (user, role) => {
    try {
        const userDocRef = getUserDocRef(user.uid, role);
        await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role,
            lastLogin: getCurrentTimestamp(),
        });
    } catch (error) {
        console.error("Error adding user to Firestore:", error);
        throw error;
    }
};

export const readUser = async (userId) => {
    for (const role of roles) {
        const userDocRef = getUserDocRef(userId, role);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
    }
    throw new Error(`User with ID ${userId} does not exist.`);
};

export const updateUser = async (userId, updatedFields) => {
    const user = await readUser(userId); // get role
    const userDocRef = getUserDocRef(userId, user.role);
    try {
        await updateDoc(userDocRef, updatedFields);
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    const user = await readUser(userId); // get role
    const userDocRef = getUserDocRef(userId, user.role);
    try {
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error("Error deleting user from Firestore:", error);
        throw error;
    }
};

export const queryUserByField = async (field, value) => {
    const foundUsers = [];

    for (const role of roles) {
        const roleCollectionRef = getUserCollectionRef(role);
        const userQuery = query(roleCollectionRef, where(field, "==", value));
        const querySnapshot = await getDocs(userQuery);

        querySnapshot.forEach((doc) => {
            foundUsers.push({ id: doc.id, ...doc.data() });
        });
    }

    return foundUsers;
};

export const getUsersByRole = async (role) => {
    const collectionRef = getUserCollectionRef(role);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};