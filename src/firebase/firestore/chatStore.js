import { db } from "../config";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs, addDoc, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";

export const createChat = async (chatId, participants) => {
  try {
    await setDoc(doc(db, "chats", chatId), {
      participants,
      createdAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChat = async (chatId) => {
  try {
    const chatDoc = await getDoc(doc(db, "chats", chatId));
    if (chatDoc.exists()) {
      return { id: chatDoc.id, ...chatDoc.data() };
    } else {
      throw new Error(`Chat with ID ${chatId} does not exist.`);
    }
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};

export const updateChat = async (chatId, updatedFields) => {
  try {
    await updateDoc(doc(db, "chats", chatId), updatedFields);
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const messagesSnapshot = await getDocs(collection(chatRef, "messages"));
    const deletePromises = messagesSnapshot.docs.map((messageDoc) => deleteDoc(messageDoc.ref));
    await Promise.all(deletePromises);
    await deleteDoc(chatRef);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

export const addMessageToChat = async (chatId, sender, message) => {
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      sender,
      message,
      timestamp: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};

export const getMessagesForChat = async (chatId) => {
  try {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const messagesSnapshot = await getDocs(q);
    return messagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching messages for chat:", error);
    throw error;
  }
};

export const deleteMessage = async (chatId, messageId) => {
  try {
    await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const listenToMessages = (chatId, callback) => {
  try {
    const messagesRef = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error listening to messages for chat:", error);
    throw error;
  }
};