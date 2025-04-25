import {db} from "../config";
import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    getDoc,
    addDoc,
    query,
    orderBy,
    Timestamp,
    onSnapshot,
    limit
} from "firebase/firestore";

const COLLECTION = "chats";
const SUB_COLLECTION = "messages";

const getCurrentTimestamp = () => Timestamp.fromDate(new Date());
const getChatDocRef = (chatId) => doc(db, COLLECTION, chatId);
const getMessagesCollectionRef = (chatId) => collection(db, COLLECTION, chatId, SUB_COLLECTION);

export const createChat = async (chatId, participants) => {
    const readStatus = Object.fromEntries(participants.map(uid => [uid, getCurrentTimestamp()]));

    try {
        await setDoc(getChatDocRef(chatId), {
            participants,
            createdAt: getCurrentTimestamp(),
            readStatus
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

export const getChat = async (chatId) => {
    try {
        const chatDoc = await getDoc(getChatDocRef(chatId));
        if (chatDoc.exists()) {
            return {id: chatDoc.id, ...chatDoc.data()};
        } else {
            throw new Error(`Chat with ID ${chatId} does not exist.`);
        }
    } catch (error) {
        console.error("Error fetching chat:", error);
        throw error;
    }
};

export const addMessageToChat = async (chatId, sender, message, isFile) => {
    try {
        await addDoc(getMessagesCollectionRef(chatId), {
            sender,
            message,
            isFile,
            timestamp: getCurrentTimestamp(),
        });
    } catch (error) {
        console.error("Error adding message to chat:", error);
        throw error;
    }
};

export const listenToMessages = (chatId, callback) => {
    try {
        const messagesQuery = query(
            getMessagesCollectionRef(chatId),
            orderBy("timestamp", "asc")
        );

        return onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            callback(messages);
        });
    } catch (error) {
        console.error("Error listening to messages for chat:", error);
        throw error;
    }
};

export const listenToLastMessage = (chatId, callback) => {
    try {
        const lastMessageQuery = query(
            getMessagesCollectionRef(chatId),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        return onSnapshot(lastMessageQuery, (snapshot) => {
            callback(snapshot.empty ? null : snapshot.docs[0].data());
        });
    } catch (error) {
        console.error("Error listening to last message:", error);
        throw error;
    }
};

export const updateReadStatus = async (chatId, userId) => {
    try {
        await updateDoc(getChatDocRef(chatId), {
            [`readStatus.${userId}`]: getCurrentTimestamp()
        });
    } catch (error) {
        console.error("Error updating read status:", error);
        throw error;
    }
};

export const listenToChatMeta = (chatId, callback) => {
    try {
        return onSnapshot(getChatDocRef(chatId), (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data());
            }
        });
    } catch (error) {
        console.error("Error listening to chat metadata:", error);
        throw error;
    }
};