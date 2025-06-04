import {db} from "../config";
import {
    doc,
    setDoc,
    getDoc,
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
        status: "ongoing"
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