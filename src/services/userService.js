import {queryUserByField} from "../firebase/firestore/userStore";
import {chatExistForUser} from "../firebase/firestore/userChatStore";

export const findNewUsers = async (currentUserId, field, fieldValue) => {
    try {
        const matchedUsers = await queryUserByField(field, fieldValue);

        const newUsers = [];
        for (const user of matchedUsers) {
            const chatId = [currentUserId, user.uid].sort().join("_");
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