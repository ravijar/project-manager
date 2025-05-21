import {
    addParticipantToChat,
    createChat,
    getChat,
    listenToChatMeta,
    listenToLastMessage, removeParticipantFromChat,
    updateReadStatus
} from "../firebase/firestore/chatsCollection.js";
import {addChatToUser, listenToChatIds, removeChatFromUser} from "../firebase/firestore/userChatsCollection.js";
import {getOtherUserFromChatId} from "./userService.js";
import {syncMessages} from "./messageService.js";
import {v4 as uuidv4} from "uuid";

export const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

export const generateGroupChatId = () => ["group", uuidv4()].join("_");

export const sortChatsByLastMessage = (chats) => {
    return chats.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
};

export const createNewPrivateChat = async (currentUser, otherUser) => {
    const chatId = generateChatId(currentUser.id, otherUser.id);

    await createChat(chatId, [currentUser.id, otherUser.id], null, currentUser.id);
    await addChatToUser(currentUser.id, chatId);
    await addChatToUser(otherUser.id, chatId);

    return chatId;
};

export const createNewGroupChat = async (groupName, participants, createdBy) => {
    const chatId = generateGroupChatId();
    const participantIds = participants.map(user => user.id);

    await createChat(chatId, participantIds, groupName, createdBy.id);

    return chatId;
}

export const createNewUserGroupChat = async (groupName, participants, createdBy) => {
    const chatId = createNewGroupChat(groupName, participants, createdBy);
    await Promise.all(participants.map((user) => addChatToUser(user.id, chatId)));
    return chatId;
};

export const createNewAssignmentChat = async (assignmentId, participants, createdBy) => {
    return await createNewGroupChat(assignmentId, participants, createdBy);
}

export const addParticipant = async (userId, chatId) => {
    await addParticipantToChat(chatId, userId);
    await addChatToUser(userId, chatId);
}

export const removeParticipant = async (userId, chatId) => {
    await removeParticipantFromChat(chatId, userId);
    await removeChatFromUser(userId, chatId);
}

export const syncChats = (userId, callback) => {
    const chatListeners = new Map();

    const unsubscribe = listenToChatIds(userId, async (chatIds) => {
        const chatDetails = await Promise.all(chatIds.map(async (chatId) => {
            try {
                const chatMeta = await getChat(chatId);
                const isGroup = chatMeta?.isGroup === true;

                const lastRead = chatMeta?.readStatus?.[userId]?.toMillis?.() || 0;

                const chatData = {
                    chatId,
                    lastMessage: null,
                    lastTimestamp: null,
                    lastRead,
                    isGroup,
                };

                if (isGroup) {
                    chatData.groupName = chatMeta?.groupName || "Unnamed Group";
                } else {
                    const userData = await getOtherUserFromChatId(chatId, userId);
                    if (!userData) return null;
                    chatData.user = userData;
                }

                return chatData;
            } catch (err) {
                console.warn(`Error processing chat ${chatId}:`, err);
                return null;
            }
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