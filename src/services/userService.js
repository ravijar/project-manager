import {queryUserByField, readUser} from "../firebase/firestore/userStore";
import {chatExistForUser} from "../firebase/firestore/userChatStore";
import {generateChatId} from "./chatService.js";

export const findNewUsers = async (currentUserId, field, fieldValue) => {
    try {
        const matchedUsers = await queryUserByField(field, fieldValue);

        const newUsers = [];
        for (const user of matchedUsers) {
            const chatId = generateChatId(currentUserId, user.uid);
            const chatExists = await chatExistForUser(currentUserId, chatId);
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