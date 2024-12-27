import { addMessageToChat, listenToMessages } from "../firebase/firestore/chatStore";

export const sendMessage = async (chatId, sender, message) => {
    await addMessageToChat(chatId, sender, message);
};

export const syncMessages = (chatId, callback) => {
    try {
        const unsubscribe = listenToMessages(chatId, callback);
        return unsubscribe;
    } catch (error) {
        console.error("Error loading messages:", error);
        throw error;
    }
};