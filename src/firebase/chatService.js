import { collection, doc, setDoc, Timestamp, arrayUnion } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addChatToUserChats = async (userId, chatId) => {
    const userChatsRef = doc(db, "user_chats", userId);

    await setDoc(
        userChatsRef,
        { chatIds: arrayUnion(chatId) },
        { merge: true }
    );
};

export const createChat = async (currentUser, otherUser) => {
    const chatId = `${currentUser.uid}_${otherUser.uid}`;
    const chatRef = doc(db, "chats", chatId);

    await setDoc(chatRef, {
      participants: [currentUser.uid, otherUser.uid],
      createdAt: Timestamp.fromDate(new Date()),
    });

    await addChatToUserChats(currentUser.uid, chatId);
    await addChatToUserChats(otherUser.uid, chatId);

    return chatId;
};

export const addMessageToChat = async (chatId, sender, receiver, message) => {
    const messagesRef = collection(doc(db, "chats", chatId), "messages");
    const messageData = {
      sender,
      receiver,
      message,
      timestamp: Timestamp.fromDate(new Date()),
    };

    await setDoc(doc(messagesRef), messageData);
};
