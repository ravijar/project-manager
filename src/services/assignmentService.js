import {addAssignment, getAssignment} from "../firebase/firestore/assignmentsCollection.js";
import {addAssignmentToUser, listenToUserAssignments} from "../firebase/firestore/userAssignmentsCollection.js";
import {v4 as uuidv4} from "uuid";
import {createNewAssignmentChat} from "./chatService.js";

export const generateAssignmentId = () => {
    return "ASSIGNMENT--" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, user) => {
    const chatId = await createNewAssignmentChat(assignmentId, [user], user);
    await addAssignment(assignmentId, {...assignmentData, student: user.id, chatId: chatId});
    await addAssignmentToUser(user.id, assignmentId, "new");
};

export const syncAssignments = (userId, status, callback) => {
    let activeListeners = new Map();

    const unsubscribe = listenToUserAssignments(userId, status, async (assignmentIds) => {
        const assignments = await Promise.all(
            assignmentIds.map(async (id) => {
                try {
                    const data = await getAssignment(status, id);
                    return {id, ...data};
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