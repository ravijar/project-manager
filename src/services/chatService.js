import {
    addParticipantToChat,
    createChat,
    getChat,
    listenToChatMeta,
    listenToLastMessage, removeParticipantFromChat,
    updateReadStatus
} from "../firebase/firestore/chatsCollection.js";
import {addChatToUser, listenToChatIds, removeChatFromUser} from "../firebase/firestore/userChatsCollection.js";
import {getOtherUserFromParticipants} from "./userService.js";
import {syncMessages} from "./messageService.js";
import {v4 as uuidv4} from "uuid";
import {getAssignment} from "../firebase/firestore/assignmentsCollection.js";

export const generateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

export const generateGroupChatId = () => ["group", uuidv4()].join("_");

export const getChatById = async (chatId, userId) => {
    try {
        const chatMeta = await getChat(chatId);
        if (!chatMeta) return null;

        const isGroup = chatMeta?.isGroup === true;
        const isAssignment = chatMeta?.isAssignment === true;
        const assignmentId = chatMeta?.assignmentId;
        const assignment = isAssignment ? await getAssignment(assignmentId) : null;
        const lastRead = chatMeta?.readStatus?.[userId]?.toMillis?.() || 0;
        const participants = chatMeta?.participants ?? [];

        const chatData = {
            chatId,
            lastMessage: null,
            lastTimestamp: null,
            lastRead,
            isGroup,
            isAssignment,
            assignment,
            participants,
        };

        if (isGroup) {
            chatData.groupName = chatMeta?.groupName || "Unnamed Group";
        } else {
            const userData = await getOtherUserFromParticipants(participants, userId);
            if (!userData) return null;
            chatData.user = userData;
        }

        return chatData;
    } catch (error) {
        console.error("Error in getChatById:", error);
        return null;
    }
};

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

export const createNewGroupChat = async (groupName, participants, createdBy, isAssignment = false, assignmentId = null) => {
    const chatId = generateGroupChatId();
    const participantIds = participants.map(user => user.id);

    await createChat(chatId, participantIds, groupName, createdBy.id, isAssignment, assignmentId);
    await Promise.all(participants.map((user) => addChatToUser(user.id, chatId)));

    return chatId;
};

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
        const chatDetails = await Promise.all(
            chatIds.map((chatId) => getChatById(chatId, userId))
        );

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