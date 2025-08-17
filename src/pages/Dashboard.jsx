import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/chat/ChatWindow.jsx';
import './Dashboard.css';
import {useState, useEffect} from 'react';
import {sendMessage} from '../services/messageService';
import {syncChats, selectChat, getChatById} from '../services/chatService';
import Workspace from "../components/container/workspace/Workspace.jsx";

const Dashboard = ({user, handleSignOut}) => {
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedAssignmentChats, setSelectedAssignmentChats] = useState({ group: null, tutor: null, student: null });
    const [chatsError, setChatsError] = useState("");

    const [messages, setMessages] = useState([]);
    const [assignmentMessages, setAssignmentMessages] = useState({});
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        const chatsCleanup = fetchChats();
        return () => {
            if (chatsCleanup) chatsCleanup();
        };
    }, [user]);

    const timeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit"
    }

    const formatMessages = (rawMessages, userId) => {
        return rawMessages.map((msg) => ({
            text: msg.message,
            time: new Date(msg.timestamp.toDate()).toLocaleTimeString([], timeFormatOptions),
            isSender: msg.senderId === userId,
            date: new Date(msg.timestamp.toDate()).toLocaleDateString(),
            isFile: msg.isFile,
            senderName: msg.senderName,
            senderRole: msg.senderRole,
        }));
    };

    const createLocalMessage = (text, isFile) => {
        const now = new Date();
        return {
            text,
            isSender: true,
            time: now.toLocaleTimeString([], timeFormatOptions),
            date: now.toLocaleDateString(),
            isFile
        };
    };

    const fetchChats = () => {
        if (!user?.id) return;

        setLoadingChats(true);
        setChatsError("");

        const unsubscribe = syncChats(user.id, (updateFnOrChats) => {
            if (typeof updateFnOrChats === "function") {
                setChats(prev => updateFnOrChats(prev));
            } else {
                setChats(updateFnOrChats);
            }
            setLoadingChats(false);
        });

        return () => {
            unsubscribe();
            setLoadingChats(false);
        };
    };

    const handleChatSelect = async (chatId) => {
        setLoadingMessages(true);
        setMessages([]);
        if (unsubscribe) unsubscribe();

        const chat = chats.find((c) => c.chatId === chatId);
        if (!chat) return;

        setSelectedChat(chat);
        setAssignmentMessages({ group: [], tutor: [], student: [] });

        const unsubs = [];

        const unsub = await selectChat(chatId, user.id, (fetchedMessages) => {
            setMessages(formatMessages(fetchedMessages, user.id));
        });

        unsubs.push(unsub);
        setUnsubscribe(() => () => unsubs.forEach(u => u && u()));
        setLoadingMessages(false);

        if (chat.isAssignment) {
            const { chatIds } = (chat.assignment || selectedChat?.assignment || {});
            setSelectedAssignmentChats({ group: null, tutor: null, student: null });
            if (chatIds?.group) {
                const u = await selectChat(chatIds.group, user.id, (msgs) => {
                    setAssignmentMessages(prev => ({ ...prev, group: formatMessages(msgs, user.id) }));
                });
                unsubs.push(u);
            }
            if (chatIds?.tutor) {
                const u = await selectChat(chatIds.tutor, user.id, (msgs) => {
                    setAssignmentMessages(prev => ({ ...prev, tutor: formatMessages(msgs, user.id) }));
                });
                unsubs.push(u);
            }
            if (chatIds?.student) {
                const u = await selectChat(chatIds.student, user.id, (msgs) => {
                    setAssignmentMessages(prev => ({ ...prev, student: formatMessages(msgs, user.id) }));
                });
                unsubs.push(u);
            }

            const [groupChat, tutorChat, studentChat] = await Promise.all([
                chatIds?.group ? getChatById(chatIds.group, user.id) : null,
                chatIds?.tutor ? getChatById(chatIds.tutor, user.id) : null,
                chatIds?.student ? getChatById(chatIds.student, user.id) : null,
            ]);

            setSelectedAssignmentChats({ group: groupChat, tutor: tutorChat, student: studentChat });

            setUnsubscribe(() => () => unsubs.forEach(u => u && u()));
        }
    };

    const handleNewMessage = async (chat, newMessage, isFile = false) => {
        if (!chat) {
            console.error("No chat provided.");
            return;
        }

        const localMsg = createLocalMessage(newMessage, isFile);
        setMessages((prev) => [...prev, localMsg]);

        if (chat.isAssignment && chat.assignment?.chatIds) {
            const { group, tutor, student } = chat.assignment.chatIds || {};
            const id = chat.chatId;
            if (id === group) {
                setAssignmentMessages((prev) => ({ ...prev, group: [...prev.group, localMsg] }));
            } else if (id === tutor) {
                setAssignmentMessages((prev) => ({ ...prev, tutor: [...prev.tutor, localMsg] }));
            } else if (id === student) {
                setAssignmentMessages((prev) => ({ ...prev, student: [...prev.student, localMsg] }));
            }
        }

        try {
            await sendMessage(chat.chatId, user, newMessage, isFile);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prev) => prev.filter((m) => m.text !== newMessage));

            if (chat.isAssignment && chat.assignment?.chatIds) {
                const { group, tutor, student } = chat.assignment.chatIds || {};
                const id = chat.chatId;
                if (id === group) {
                    setAssignmentMessages((prev) => ({ ...prev, group: prev.group.filter((m) => m.text !== newMessage) }));
                } else if (id === tutor) {
                    setAssignmentMessages((prev) => ({ ...prev, tutor: prev.tutor.filter((m) => m.text !== newMessage) }));
                } else if (id === student) {
                    setAssignmentMessages((prev) => ({ ...prev, student: prev.student.filter((m) => m.text !== newMessage) }));
                }
            }
        }
    };

    return (
        <div className="container">
            <SideWindow
                chats={chats.filter(c => !c.isAssignment)}
                loadingChats={loadingChats}
                selectedChat={selectedChat}
                onSelectChat={handleChatSelect}
                assignmentChats={chats.filter(c => c.isAssignment)}
                user={user}
                onSignOut={handleSignOut}
                onTabChange={() => setSelectedChat(null)}
            />
            {!loadingChats && !chatsError && selectedChat && !selectedChat?.isAssignment && (
                <ChatWindow
                    messages={messages}
                    selectedChat={selectedChat}
                    onNewMessage={handleNewMessage}
                    loadingMessages={loadingMessages}
                />
            )}

            {!loadingChats && !chatsError && selectedChat && selectedChat?.isAssignment && (
                <Workspace
                    leftChatProps={
                        selectedAssignmentChats?.student
                            ? {
                                messages: assignmentMessages.student,
                                selectedChat: selectedAssignmentChats?.student,
                                onNewMessage: handleNewMessage,
                                loadingMessages
                            }
                            : {}
                    }
                    rightChatProps={
                        selectedAssignmentChats?.tutor
                            ? {
                                messages: assignmentMessages.tutor,
                                selectedChat: selectedAssignmentChats?.tutor,
                                onNewMessage: handleNewMessage,
                                loadingMessages
                            }
                            : {}
                    }
                />
            )}
        </div>
    );
};

export default Dashboard;
