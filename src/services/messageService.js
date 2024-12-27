import { addMessageToChat } from "../firebase/firestore/chatStore";

export const sendMessage = async (chatId, sender, message) => {
    await addMessageToChat(chatId, sender, message);
};