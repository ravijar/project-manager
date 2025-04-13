import { addAssignment } from "../firebase/firestore/assignmentsCollection.js";
import { addAssignmentToUser } from "../firebase/firestore/userAssignmentsCollection.js";
import { v4 as uuidv4 } from "uuid";

export const generateAssignmentId = () => {
    return "ASSIGNMENT--" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, userId) => {
    await addAssignment(assignmentId, {...assignmentData, student: userId});
    await addAssignmentToUser(userId, assignmentId, "new");
};
