import {db} from "../config";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    Timestamp
} from "firebase/firestore";

const COLLECTION = "assignments";

const getCurrentTimestamp = () => Timestamp.fromDate(new Date());
const getAssignmentDocRef = (assignmentId) => doc(db, COLLECTION, assignmentId);

export const addAssignment = async (assignmentId, initialData) => {
    const {
        name,
        field,
        description,
        docs = [],
        dueBy,
        student,
        chatId,
    } = initialData;

    const assignmentData = {
        name,
        field,
        description,
        docs,
        dueBy,
        student,
        chatId,
        uploadedOn: getCurrentTimestamp(),
        tutorStartedOn: null,
        tutorFinishedOn: null,
        tutor: null,
        admin: null,
        bidders: [],
        status: "ongoing",
        subStatus: "uploaded"
    };

    try {
        await setDoc(getAssignmentDocRef(assignmentId), assignmentData);
    } catch (error) {
        console.log("Error creating assignment:", error);
        throw error;
    }

};

export const getAssignment = async (assignmentId) => {
    try {
        const assignmentDoc = await getDoc(getAssignmentDocRef(assignmentId));
        if (assignmentDoc.exists()) {
            return {id: assignmentDoc.id, ...assignmentDoc.data()};
        } else {
            throw new Error(`Assignment with ID ${assignmentId} does not exist.`);
        }
    } catch (error) {
        console.error("Error fetching assignment:", error);
        throw error;
    }
};

export const updateAssignment = async (assignmentId, updatedFields, arrayFields = []) => {
    const docRef = getAssignmentDocRef(assignmentId);

    try {
        const updatePayload = {};

        for (const [key, value] of Object.entries(updatedFields)) {
            if (arrayFields.includes(key)) {
                updatePayload[key] = arrayUnion(value);
            } else {
                updatePayload[key] = value;
            }
        }

        await updateDoc(docRef, updatePayload);
    } catch (error) {
        console.error("Failed to update assignment fields:", error);
        throw error;
    }
};