import {addMessageToChat, listenToMessages} from "../firebase/firestore/chatsCollection.js";

export const sendMessage = async (chatId, sender, message, isFile) => {
    await addMessageToChat(chatId, sender, message, isFile);
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