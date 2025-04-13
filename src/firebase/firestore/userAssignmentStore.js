import { db } from "../config";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    getDoc
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
