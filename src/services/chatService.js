import {createChat} from "../firebase/firestore/chatStore";
import {addChatToUser, listenToChatIds} from "../firebase/firestore/userChatStore";
import { listenToLastMessage } from "../firebase/firestore/chatStore";
import {readUser} from "../firebase/firestore/userStore";

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const participants = [currentUser.uid, otherUser.id];
    const chatId = participants.sort().join("_");

    await createChat(chatId, participants);
    await addChatToUser(currentUser.uid, chatId);
    await addChatToUser(otherUser.id, chatId);

    return chatId;
};

export const syncChats = (userId, callback) => {
    const chatListeners = new Map();

    const unsubscribe = listenToChatIds(userId, async (chatIds) => {
        const chatDetails = await Promise.all(chatIds.map(async (chatId) => {
            const otherUserId = chatId.split("_").find(id => id !== userId);
            if (!otherUserId) return null;

            const userData = await readUser(otherUserId);

            return {
                chatId,
                user: userData,
                lastMessage: null,
                lastTimestamp: null
            };
        }));

        const enrichedChats = chatDetails.filter(Boolean);

        enrichedChats.forEach((chat) => {
            if (chatListeners.has(chat.chatId)) return;

            const unsub = listenToLastMessage(chat.chatId, (lastMsg) => {
                chat.lastMessage = lastMsg?.message || "";
                chat.lastTimestamp = lastMsg?.timestamp?.toMillis?.() || 0;

                // Update chat list and sort
                callback((prevChats = []) => {
                    const updated = prevChats.map((c) => (c.chatId === chat.chatId ? { ...c, ...chat } : c));
                    return updated.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
                });
            });

            chatListeners.set(chat.chatId, unsub);
        });

        callback(() =>
            enrichedChats.sort((a, b) => b.lastTimestamp - a.lastTimestamp)
        );
    });

    return () => {
        unsubscribe();
        chatListeners.forEach((unsub) => unsub());
    };
};