import {db} from "../config";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    query,
    where,
    getDocs,
    collection,
    onSnapshot
} from "firebase/firestore";

export const addChatToUser = async (userId, chatId) => {
    try {
        const userChatsRef = doc(db, "user_chats", userId);
        await setDoc(
            userChatsRef,
            {chatIds: arrayUnion(chatId)},
            {merge: true}
        );
        console.log(`Chat ID ${chatId} added to user ${userId} successfully.`);
    } catch (error) {
        console.error("Error adding chat to user:", error);
        throw error;
    }
};

export const chatExistForUser = async (userId, chatId) => {
    try {
        const userChatsRef = collection(db, "user_chats");
        const chatQuery = query(
            userChatsRef,
            where("chatIds", "array-contains", chatId),
            where("__name__", "==", userId)
        );

        const querySnapshot = await getDocs(chatQuery);

        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking if chat exists for user:", error);
        throw error;
    }
};

export const listenToChatIds = (userId, callback) => {
    try {
        const userChatsRef = doc(db, "user_chats", userId);

        const unsubscribe = onSnapshot(userChatsRef, (snapshot) => {
            if (snapshot.exists()) {
                const chatIds = snapshot.data().chatIds || [];
                callback(chatIds);
            } else {
                console.warn(`No chats found for user ${userId}`);
                callback([]);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error("Error listening to chat IDs for user:", error);
        throw error;
    }
};