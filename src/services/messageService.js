import {addMessageToChat, listenToMessages} from "../firebase/firestore/chatsCollection.js";

export const sendMessage = async (chatId, sender, message, isFile) => {
    await addMessageToChat(chatId, sender.id, sender.name, sender.role, message, isFile);
};

export const syncMessages = (chatId, callback) => {
    try {
        return listenToMessages(chatId, callback);
    } catch (error) {
        console.error("Error loading messages:", error);
        throw error;
    }
};