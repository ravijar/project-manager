import {queryUserByField, readUser} from "../firebase/firestore/usersCollection.js";
import {chatExistsForUser} from "../firebase/firestore/userChatsCollection.js";
import {generateChatId} from "./chatService.js";

export const USER_ROLES = ["admin", "student", "tutor"];

export const findUsers = async (currentUserId, role, field, fieldValue) => {
    try {
        const matchedUsers = await queryUserByField(role, field, fieldValue);
        return matchedUsers.filter((user) => user.id !== currentUserId);
    } catch (error) {
        console.error("Error finding users:", error);
        throw error;
    }
};

export const findNewUsers = async (currentUserId, role, field, fieldValue) => {
    try {
        const matchedUsers = await queryUserByField(role, field, fieldValue);

        const newUsers = [];
        for (const user of matchedUsers) {
            if (user.id === currentUserId) continue;

            const chatId = generateChatId(currentUserId, user.id);
            const chatExists = await chatExistsForUser(currentUserId, chatId);
            if (!chatExists) {
                newUsers.push(user);
            }
        }

        return newUsers;
    } catch (error) {
        console.error("Error finding new users:", error);
        throw error;
    }
};

export const getOtherUserFromChatId = async (chatId, currentUserId) => {
    try {
        const participants = chatId.split('_');
        const otherUserId = participants.find(id => id !== currentUserId);

        if (!otherUserId) return null;

        return await readUser(otherUserId);
    } catch (error) {
        console.error("Error fetching other user from chat ID:", error);
        return null;
    }
};

export const getOtherUserFromParticipants = async (participants, currentUserId) => {
    try {
        const otherUserId = participants.find(id => id !== currentUserId);

        if (!otherUserId) return null;

        return await readUser(otherUserId);
    } catch (error) {
        console.error("Error fetching other user from chat ID:", error);
        return null;
    }
};