import { db } from "../config";
import {
    doc,
    getDoc,
    setDoc,
    deleteField,
    updateDoc,
    Timestamp
} from "firebase/firestore";

const COLLECTION = "assignments";

const ensureDocument = async (docRef) => {
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        await setDoc(docRef, {});
    }
};

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

    const assignmentRef = doc(db, COLLECTION, "new");

    await ensureDocument(assignmentRef);

    await updateDoc(assignmentRef, {
        [assignmentId]: assignmentData
    });
};

export const updateAssignment = async (status, assignmentId, updatedFields) => {
    const assignmentRef = doc(db, COLLECTION, status);

    await ensureDocument(assignmentRef);

    await updateDoc(assignmentRef, {
        [assignmentId]: updatedFields
    });
};

export const moveAssignment = async (fromStatus, toStatus, assignmentId) => {
    const fromRef = doc(db, COLLECTION, fromStatus);
    const toRef = doc(db, COLLECTION, toStatus);

    const fromSnap = await getDoc(fromRef);
    const assignmentData = fromSnap.data()?.[assignmentId];

    if (!assignmentData) throw new Error("Assignment not found in source.");

    await ensureDocument(toRef);

    await updateDoc(toRef, {
        [assignmentId]: assignmentData
    });

    await updateDoc(fromRef, {
        [assignmentId]: deleteField()
    });
};
