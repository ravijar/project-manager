import {createChat, listenToLastMessage} from "../firebase/firestore/chatStore";
import {addChatToUser, listenToChatIds} from "../firebase/firestore/userChatStore";
import {getOtherUserFromChatId} from "./userService.js";

export const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

export const sortChatsByLastMessage = (chats) => {
    return chats.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
};

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const chatId = generateChatId(currentUser.uid, otherUser.id);

    await createChat(chatId, [currentUser.uid, otherUser.id]);
    await addChatToUser(currentUser.uid, chatId);
    await addChatToUser(otherUser.id, chatId);

    return chatId;
};

export const syncChats = (userId, callback) => {
    const chatListeners = new Map();

    const unsubscribe = listenToChatIds(userId, async (chatIds) => {
        const chatDetails = await Promise.all(chatIds.map(async (chatId) => {
            const userData = await getOtherUserFromChatId(chatId, userId);
            if (!userData) return null;

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
                    return sortChatsByLastMessage(updated);
                });
            });

            chatListeners.set(chat.chatId, unsub);
        });

        callback(() => sortChatsByLastMessage(enrichedChats));
    });

    return () => {
        unsubscribe();
        chatListeners.forEach((unsub) => unsub());
    };
};