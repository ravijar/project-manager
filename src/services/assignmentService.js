import {addAssignment, getAssignment, updateAssignment, getAllAssignments} from "../firebase/firestore/assignmentsCollection.js";
import {addAssignmentToUser} from "../firebase/firestore/userAssignmentsCollection.js";
import {addAssignmentField, getAllAssignmentFields} from "../firebase/firestore/assignmentFieldCollection";
import {v4 as uuidv4} from "uuid";
import {addParticipant, createNewGroupChat} from "./chatService.js";
import {Timestamp} from "firebase/firestore";
import {createChat} from "../firebase/firestore/chatsCollection.js";

export const generateAssignmentId = () => {
    return "assignment_" + uuidv4()
};

export const generateChatId = (assignmentId, role) => {
    return [assignmentId, role].join("_");
};

export const addNewAssignment = async (assignmentId, assignmentData, user) => {
    const groupChatId = await createNewGroupChat(assignmentData?.name, [user], user, true, assignmentId);
    const chatIds = {
        group: groupChatId,
        tutor: null,
        student: null,
    };

    await addAssignment(assignmentId, {...assignmentData, student: user.id, chatIds});
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

export const createNewPrivateChat = async (assignment, role) => {
    const chatId = generateChatId(assignment.id, role);
    const fieldPath = `chatIds.${role}`;

    await createChat(chatId, [assignment.admin, assignment[role]], null, assignment.admin, true, assignment.id);

    await updateAssignment(assignment.id, { [fieldPath]: chatId });

    return chatId;
};

export const assignAdminToAssignment = async (assignmentId, adminUserId) => {
    try {
        const assignment = await fetchAssignmentById(assignmentId);
        const groupChatId = assignment.chatIds?.group;

        groupChatId && await addParticipant(adminUserId, groupChatId);

        await addAssignmentToUser(adminUserId, assignmentId);

        await updateAssignment(assignmentId, {
            admin: adminUserId,
            subStatus: "admin_assigned"
        });

        assignment.student && await createNewPrivateChat({ ...assignment, admin: adminUserId }, "student");

    } catch (error) {
        console.error("Failed to assign admin to assignment:", error);
        throw error;
    }
};

export const assignTutorToAssignment = async (assignmentId, tutorUserId) => {
    try {
        const assignment = await fetchAssignmentById(assignmentId);
        const groupChatId = assignment.chatIds?.group;

        groupChatId && await addParticipant(tutorUserId, groupChatId);

        await addAssignmentToUser(tutorUserId, assignmentId);

        await updateAssignment(assignmentId, {
            tutor: tutorUserId,
            tutorStartedOn: Timestamp.fromDate(new Date()),
            subStatus: "tutor_assigned"
        });

        assignment.admin && await createNewPrivateChat({ ...assignment, tutor: tutorUserId }, "tutor");

    } catch (error) {
        console.error("Failed to assign tutor to assignment:", error);
        throw error;
    }
};

export const addBidToAssignment = async (assignmentId, bidderId, bidAmount) => {
    try {
      const updates = {
        bidders: { bidderId, bid: bidAmount },
      };
  
      await updateAssignment(
        assignmentId,
        updates,
        ["bidders"] // keep your merge/field-mask behavior if needed
      );
      console.log(`Bid added by ${bidderId} on ${assignmentId}: ${bidAmount}`);
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

export const updateAssignmentSubStatus = async (assignmentId, newSubStatus) => {
    try {
      if (!newSubStatus) throw new Error("newSubStatus is required");
      await updateAssignment(assignmentId, { subStatus: newSubStatus });
      console.log(`SubStatus of ${assignmentId} set to ${newSubStatus}`);
    } catch (error) {
      console.error("Failed to update subStatus:", error);
      throw error;
    }
  };

  
