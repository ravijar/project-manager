import { collection, doc, setDoc, Timestamp, arrayUnion, getDoc, onSnapshot, query, orderBy } from "firebase/firestore";
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

export const addMessageToChat = async (chatId, sender, message) => {
    const messagesRef = collection(doc(db, "chats", chatId), "messages");
    const messageData = {
      sender,
      message,
      timestamp: Timestamp.fromDate(new Date()),
    };

    await setDoc(doc(messagesRef), messageData);
};

export const getChatsForCurrentUser = async (currentUserUid) => {
    const userChatsRef = doc(db, "user_chats", currentUserUid);
    const userChatsSnapshot = await getDoc(userChatsRef);

    if (!userChatsSnapshot.exists()) {
      return [];
    }

    const { chatIds = [] } = userChatsSnapshot.data();

    const chats = await Promise.all(
      chatIds.map(async (chatId) => {
        const otherUserId = chatId.split("_").find((id) => id !== currentUserUid);

        const userRef = doc(db, "users", otherUserId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const otherUserData = userSnapshot.data();
          return {
            chatId,
            user: otherUserData,
          };
        }
        return null;
      })
    );

    return chats.filter((chat) => chat !== null);
};

export const getMessagesForChat = (chatId, callback) => {
    const messagesRef = collection(db, "chats", chatId, "messages");

    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });

    return unsubscribe; 
};