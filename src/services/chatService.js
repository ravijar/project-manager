import { createChat } from "../firebase/firestore/chatStore";
import { addChatToUser, listenToChatIds } from "../firebase/firestore/userChatStore";
import { readUser } from "../firebase/firestore/userStore";

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const participants = [currentUser.uid, otherUser.uid];
    const chatId = participants.sort().join("_");

    await createChat(chatId, participants);
    await addChatToUser(currentUser.uid, chatId);
    await addChatToUser(otherUser.uid, chatId);

    return chatId;
};

export const syncChats = (userId, callback) => {
    try {
      const unsubscribe = listenToChatIds(userId, async (chatIds) => {
        const chats = await Promise.all(
          chatIds.map(async (chatId) => {
            const otherUserId = chatId.split("_").find((id) => id !== userId);
  
            if (!otherUserId) return null;
  
            const otherUserData = await readUser(otherUserId);
            return { chatId, user: otherUserData };
          })
        );
  
        callback(chats.filter((chat) => chat !== null));
      });
  
      return unsubscribe;
    } catch (error) {
      console.error("Error syncing chats:", error);
      throw error;
    }
  };