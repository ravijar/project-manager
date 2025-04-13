import { addAssignment } from "../firebase/firestore/assignmentStore";
import { addAssignmentToUser } from "../firebase/firestore/userAssignmentStore";
import { v4 as uuidv4 } from "uuid";

export const addNewAssignment = async (assignmentData, userId) => {
    const assignmentId = uuidv4();

    await addAssignment(assignmentId, {...assignmentData, student: userId});
    await addAssignmentToUser(userId, assignmentId, "new");

    return assignmentId;
};
