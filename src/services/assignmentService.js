import {addAssignment, getAssignment} from "../firebase/firestore/assignmentsCollection.js";
import {addAssignmentToUser, listenToUserAssignments} from "../firebase/firestore/userAssignmentsCollection.js";
import {v4 as uuidv4} from "uuid";

export const generateAssignmentId = () => {
    return "ASSIGNMENT--" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, userId) => {
    await addAssignment(assignmentId, {...assignmentData, student: userId});
    await addAssignmentToUser(userId, assignmentId, "new");
};

export const syncAssignments = (userId, status, callback) => {
    let activeListeners = new Map();

    const unsubscribe = listenToUserAssignments(userId, status, async (assignmentIds) => {
        const assignments = await Promise.all(
            assignmentIds.map(async (id) => {
                try {
                    const data = await getAssignment(status, id);
                    return { id, ...data };
                } catch (error) {
                    console.warn(`Failed to get assignment ${id}:`, error);
                    return null;
                }
            })
        );

        const filteredAssignments = assignments.filter(Boolean);

        callback(filteredAssignments);
    });

    return () => {
        unsubscribe();
        activeListeners.clear();
    };
};