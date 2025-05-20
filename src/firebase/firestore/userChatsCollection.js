import {db} from "../config";
import {
    doc,
    setDoc,
    getDoc,
    arrayUnion,
    onSnapshot, updateDoc, arrayRemove
} from "firebase/firestore";

const COLLECTION = "user_chats";

const getUserChatDocRef = (userId) => doc(db, COLLECTION, userId);

export const addChatToUser = async (userId, chatId) => {
    try {
        await setDoc(
            getUserChatDocRef(userId),
            {chatIds: arrayUnion(chatId)},
            {merge: true}
        );
        console.log(`Chat ID ${chatId} added to user ${userId} successfully.`);
    } catch (error) {
        console.error("Error adding chat to user:", error);
        throw error;
    }
};

export const removeChatFromUser = async (userId, chatId) => {
    try {
        await updateDoc(getUserChatDocRef(userId), {
            chatIds: arrayRemove(chatId)
        });
        console.log(`Chat ID ${chatId} removed from user ${userId} successfully.`);
    } catch (error) {
        console.error("Error removing chat from user:", error);
        throw error;
    }
};

export const chatExistsForUser = async (userId, chatId) => {
    try {
        const docSnap = await getDoc(getUserChatDocRef(userId));
        if (docSnap.exists()) {
            const chatIds = docSnap.data().chatIds || [];
            return chatIds.includes(chatId);
        }
        return false;
    } catch (error) {
        console.error("Error checking if chat exists for user:", error);
        throw error;
    }
};

export const listenToChatIds = (userId, callback) => {
    try {
        return onSnapshot(getUserChatDocRef(userId), (snapshot) => {
            if (snapshot.exists()) {
                const chatIds = snapshot.data().chatIds || [];
                callback(chatIds);
            } else {
                console.warn(`No chats found for user ${userId}`);
                callback([]);
            }
        });

    } catch (error) {
        console.error("Error listening to chat IDs for user:", error);
        throw error;
    }
};