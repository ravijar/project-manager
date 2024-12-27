import { createChat } from "../firebase/firestore/chatStore";
import { addChatToUser } from "../firebase/firestore/userChatStore";

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const participants = [currentUser.uid, otherUser.uid];
    const chatId = participants.sort().join("_");

    await createChat(chatId, participants);
    await addChatToUser(currentUser.uid, chatId);
    await addChatToUser(otherUser.uid, chatId);

    return chatId;
};