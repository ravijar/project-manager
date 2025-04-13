import { addAssignment } from "../firebase/firestore/assignmentStore";
import { addAssignmentToUser } from "../firebase/firestore/userAssignmentStore";
import { v4 as uuidv4 } from "uuid";

export const generateAssignmentId = () => {
    return "ASSIGNMENT--" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, userId) => {
    await addAssignment(assignmentId, {...assignmentData, student: userId});
    await addAssignmentToUser(userId, assignmentId, "new");
};
