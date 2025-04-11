import {
    createChat,
    getChat,
    listenToChatMeta,
    listenToLastMessage,
    updateReadStatus
} from "../firebase/firestore/chatStore";
import {addChatToUser, listenToChatIds} from "../firebase/firestore/userChatStore";
import {getOtherUserFromChatId} from "./userService.js";
import {syncMessages} from "./messageService.js";

export const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

export const sortChatsByLastMessage = (chats) => {
    return chats.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
};

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const chatId = generateChatId(currentUser.id, otherUser.id);

    await createChat(chatId, [currentUser.id, otherUser.id]);
    await addChatToUser(currentUser.id, chatId);
    await addChatToUser(otherUser.id, chatId);

    return chatId;
};

export const syncChats = (userId, callback) => {
    const chatListeners = new Map();

    const unsubscribe = listenToChatIds(userId, async (chatIds) => {
        const chatDetails = await Promise.all(chatIds.map(async (chatId) => {
            const userData = await getOtherUserFromChatId(chatId, userId);
            if (!userData) return null;

            let lastRead = 0;
            try {
                const chatMeta = await getChat(chatId);
                const timestamp = chatMeta?.readStatus?.[userId];
                lastRead = timestamp?.toMillis?.() || 0;
            } catch (err) {
                console.warn(`Error getting chat metadata for ${chatId}:`, err);
            }

            return {
                chatId,
                user: userData,
                lastMessage: null,
                lastTimestamp: null,
                lastRead
            };
        }));

        const enrichedChats = chatDetails.filter(Boolean);

        enrichedChats.forEach((chat) => {
            if (chatListeners.has(chat.chatId)) return;

            const unsubLastMsg = listenToLastMessage(chat.chatId, (lastMsg) => {
                chat.lastMessage = lastMsg?.message || "";
                chat.lastTimestamp = lastMsg?.timestamp?.toMillis?.() || 0;

                callback((prevChats = []) => {
                    const updated = prevChats.map((c) =>
                        c.chatId === chat.chatId ? {...c, ...chat} : c
                    );
                    return sortChatsByLastMessage(updated);
                });
            });

            const unsubMeta = listenToChatMeta(chat.chatId, (chatData) => {
                const read = chatData?.readStatus?.[userId]?.toMillis?.() || 0;
                chat.lastRead = read;

                callback((prevChats = []) => {
                    const updated = prevChats.map((c) =>
                        c.chatId === chat.chatId ? {...c, lastRead: read} : c
                    );
                    return sortChatsByLastMessage(updated);
                });
            });

            chatListeners.set(chat.chatId, () => {
                unsubLastMsg();
                unsubMeta();
            });
        });

        callback(() => sortChatsByLastMessage(enrichedChats));
    });

    return () => {
        unsubscribe();
        chatListeners.forEach((unsub) => unsub());
    };
};

export const selectChat = async (chatId, userId, onMessages) => {
    const unsubscribeFunction = syncMessages(chatId, async (fetchedMessages) => {
        onMessages(fetchedMessages);
        await updateReadStatus(chatId, userId);
    });

    await updateReadStatus(chatId, userId);
    return unsubscribeFunction;
};