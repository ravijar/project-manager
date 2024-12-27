import { collection, doc, setDoc, Timestamp, arrayUnion, getDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getChatsForCurrentUser = (currentUserUid, callback) => {
  const userChatsRef = doc(db, "user_chats", currentUserUid);

  const unsubscribe = onSnapshot(userChatsRef, async (userChatsSnapshot) => {
    if (!userChatsSnapshot.exists()) {
      callback([]);
      return;
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

    callback(chats.filter((chat) => chat !== null));
  });

  return unsubscribe;
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