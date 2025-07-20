import {db} from "../config";
import {
    collection,
    addDoc,
    getDocs,
} from "firebase/firestore";

const COLLECTION = "assignment_fields";

export const addAssignmentField = async (fieldName) => {
    try {
        await addDoc(collection(db, COLLECTION), {name: fieldName});
    } catch (error) {
        console.error("Error adding assignment field:", error);
        throw error;
    }
};

export const getAllAssignmentFields = async () => {
    try {
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error fetching assignment fields:", error);
        throw error;
    }
};
