import {db} from "../config";
import {
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore";

const COLLECTION = "assignments";
const SUB_COLLECTION = "instances";

const getAssignmentRef = (status, assignmentId) =>
    doc(db, COLLECTION, status, SUB_COLLECTION, assignmentId);

export const addAssignment = async (assignmentId, initialData) => {
    const {
        name,
        field,
        description,
        docs = [],
        dueBy,
        student,
    } = initialData;

    const assignmentData = {
        name,
        field,
        description,
        docs,
        dueBy,
        student,
        uploadedOn: Timestamp.fromDate(new Date()),
        tutorStartedOn: null,
        tutorFinishedOn: null,
        tutor: null,
        admin: null,
        bidders: [],
        status: null
    };

    const ref = getAssignmentRef("new", assignmentId);
    await setDoc(ref, assignmentData);
};

export const updateAssignment = async (status, assignmentId, updatedFields) => {
    const ref = getAssignmentRef(status, assignmentId);
    await setDoc(ref, updatedFields, {merge: true});
};

export const moveAssignment = async (fromStatus, toStatus, assignmentId) => {
    const fromRef = getAssignmentRef(fromStatus, assignmentId);
    const toRef = getAssignmentRef(toStatus, assignmentId);

    const fromSnap = await getDoc(fromRef);
    if (!fromSnap.exists()) throw new Error("Assignment not found in source.");

    const assignmentData = fromSnap.data();

    await setDoc(toRef, assignmentData);
    await deleteDoc(fromRef);
};

export const getAssignment = async (status, assignmentId) => {
    try {
        const assignmentRef = getAssignmentRef(status, assignmentId);
        const snapshot = await getDoc(assignmentRef);

        if (snapshot.exists()) {
            return {id: snapshot.id, ...snapshot.data()};
        } else {
            throw new Error(`Assignment with ID ${assignmentId} does not exist in status "${status}".`);
        }
    } catch (error) {
        console.error("Error fetching assignment:", error);
        throw error;
    }
};