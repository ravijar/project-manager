import {addAssignment} from "../firebase/firestore/assignmentsCollection.js";
import {addAssignmentToUser} from "../firebase/firestore/userAssignmentsCollection.js";
import {v4 as uuidv4} from "uuid";
import {createNewGroupChat} from "./chatService.js";

export const generateAssignmentId = () => {
    return "assignment_" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, user) => {
    const chatId = await createNewGroupChat(assignmentData?.name, [user], user, true, assignmentId);
    await addAssignment(assignmentId, {...assignmentData, student: user.id, chatId: chatId});
    await addAssignmentToUser(user.id, assignmentId, "new");
};
