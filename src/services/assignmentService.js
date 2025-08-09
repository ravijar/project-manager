import {addAssignment, getAssignment, updateAssignment, getAllAssignments} from "../firebase/firestore/assignmentsCollection.js";
import {addAssignmentToUser} from "../firebase/firestore/userAssignmentsCollection.js";
import {addAssignmentField, getAllAssignmentFields} from "../firebase/firestore/assignmentFieldCollection";
import {v4 as uuidv4} from "uuid";
import {addParticipant, createNewGroupChat} from "./chatService.js";
import {Timestamp} from "firebase/firestore";

export const generateAssignmentId = () => {
    return "assignment_" + uuidv4()
};

export const addNewAssignment = async (assignmentId, assignmentData, user) => {
    const chatId = await createNewGroupChat(assignmentData?.name, [user], user, true, assignmentId);
    await addAssignment(assignmentId, {...assignmentData, student: user.id, chatId: chatId});
    await addAssignmentToUser(user.id, assignmentId);
};

export const fetchAssignmentById = async (assignmentId) => {
    try {
        return await getAssignment(assignmentId);
    } catch (error) {
        console.error("Failed to fetch assignment:", error);
        throw error;
    }
};

export const assignAdminToAssignment = async (assignmentId, adminUserId) => {
    try {
        const assignment = await fetchAssignmentById(assignmentId);
        const chatId = assignment.chatId;

        await addParticipant(adminUserId, chatId);
        await addAssignmentToUser(adminUserId, assignmentId);
        await updateAssignment(assignmentId, {
            admin: adminUserId,
            subStatus: "admin_assigned"
        });
    } catch (error) {
        console.error("Failed to assign admin to assignment:", error);
        throw error;
    }
};

export const assignTutorToAssignment = async (assignmentId, tutorUserId) => {
    try {
        const assignment = await fetchAssignmentById(assignmentId);
        const chatId = assignment.chatId;

        await addParticipant(tutorUserId, chatId);
        await addAssignmentToUser(tutorUserId, assignmentId);
        await updateAssignment(assignmentId, {
            tutor: tutorUserId,
            tutorStartedOn: Timestamp.fromDate(new Date()),
            subStatus: "tutor_assigned"
        });
    } catch (error) {
        console.error("Failed to assign tutor to assignment:", error);
        throw error;
    }
};

export const addBidToAssignment = async (assignmentId, bidderId, bidAmount) => {
    try {
        const assignment = await fetchAssignmentById(assignmentId);
        const updates = {
            bidders: { bidderId, bid: bidAmount }
        };

        if (assignment.subStatus !== "bidding") {
            updates.subStatus = "bidding";
        }

        await updateAssignment(
            assignmentId,
            updates,
            ["bidders"]
        );
    } catch (error) {
        console.error("Failed to add bid to assignment:", error);
        throw error;
    }
};

export const fetchAllAssignmentFields = async () => {
    return await getAllAssignmentFields();
};

export const createNewAssignmentField = async (fieldName) => {
    return await addAssignmentField(fieldName);
};

export const fetchAllAssignments = async () => {
    try {
        return await getAllAssignments();
    } catch (error) {
        console.error("Failed to fetch all assignments:", error);
        throw error;
    }
};