import {db} from "../config";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    getDoc,
    onSnapshot
} from "firebase/firestore";

const COLLECTION = "user_assignments";

const ensureUserDoc = async (userId) => {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, {
            new: [],
            completed: [],
            ignored: []
        });
    }
};

export const addAssignmentToUser = async (userId, assignmentId, status) => {
    await ensureUserDoc(userId);

    const userRef = doc(db, COLLECTION, userId);
    await updateDoc(userRef, {
        [status]: arrayUnion(assignmentId)
    });
};

export const moveAssignmentForUser = async (userId, assignmentId, fromStatus, toStatus) => {
    await ensureUserDoc(userId);

    const userRef = doc(db, COLLECTION, userId);
    await updateDoc(userRef, {
        [fromStatus]: arrayRemove(assignmentId),
        [toStatus]: arrayUnion(assignmentId)
    });
};

export const listenToUserAssignments = (userId, status, callback) => {
    try {
        const userRef = doc(db, COLLECTION, userId);

        return onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                callback(data[status] || []);
            } else {
                console.warn(`No assignment document found for user ${userId}`);
                callback([]);
            }
        });
    } catch (error) {
        console.error("Error listening to user assignments:", error);
        throw error;
    }
};