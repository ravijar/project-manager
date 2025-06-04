import {db} from "../config";
import {
    doc,
    arrayUnion,
    setDoc,
} from "firebase/firestore";

const COLLECTION = "user_assignments";

const getUserAssignmentDocRef = (userId) => doc(db, COLLECTION, userId);

export const addAssignmentToUser = async (userId, assignmentId) => {
    try {
        await setDoc(
            getUserAssignmentDocRef(userId),
            {assignmentIds: arrayUnion(assignmentId)},
            {merge: true}
        );
        console.log(`Assignment ID ${assignmentId} added to user ${userId} successfully.`);
    } catch (error) {
        console.error("Error adding assignment to user:", error);
        throw error;
    }
};
