import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Dashboard.css';
import {useState, useEffect} from 'react';
import {sendMessage} from '../services/messageService';
import {syncMessages} from '../services/messageService';
import {syncChats, selectChat} from '../services/chatService';
import {syncAssignments} from "../services/assignmentService.js";

const Dashboard = ({user, handleSignOut}) => {
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatsError, setChatsError] = useState("");

    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [assignmentStatus, setAssignmentStatus] = useState("new");
    const [assignmentsError, setAssignmentsError] = useState("");

    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        const chatsCleanup = fetchChats();
        const assignmentsCleanup = fetchAssignments();

        return () => {
            if (chatsCleanup) chatsCleanup();
            if (assignmentsCleanup) assignmentsCleanup();
        };
    }, [user]);

    useEffect(() => {
        fetchAssignments();
    }, [assignmentStatus])

    const timeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit"
    }

    const formatMessages = (rawMessages, userId) => {
        return rawMessages.map((msg) => ({
            text: msg.message,
            time: new Date(msg.timestamp.toDate()).toLocaleTimeString([], timeFormatOptions),
            isSender: msg.sender === userId,
            date: new Date(msg.timestamp.toDate()).toLocaleDateString(),
            isFile: msg.isFile
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

        const unsub = await selectChat(chatId, user.id, (fetchedMessages) => {
            setMessages(formatMessages(fetchedMessages, user.id));
        });

        setUnsubscribe(() => unsub);
        setLoadingMessages(false);
    };

    const handleNewMessage = async (newMessage, isFile = false) => {
        if (!selectedChat) {
            console.error("No chat selected.");
            return;
        }

        setMessages((prevMessages) => [...prevMessages, createLocalMessage(newMessage, isFile)]);

        try {
            await sendMessage(selectedChat.chatId, user.id, newMessage, isFile);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.text !== newMessage));
        }
    };

    const fetchAssignments = () => {
        if (!user?.id) return;

        setLoadingAssignments(true);
        setAssignmentsError("");

        const unsubscribe = syncAssignments(user.id, assignmentStatus, (updateFnOrAssignments) => {
            if (typeof updateFnOrAssignments === "function") {
                setAssignments(prev => updateFnOrAssignments(prev));
            } else {
                setAssignments(updateFnOrAssignments);
            }
            setLoadingAssignments(false);
        });

        return () => {
            unsubscribe();
            setLoadingAssignments(false);
        };
    };

    const handleAssignmentSelect = async (assignmentId) => {
        setLoadingAssignments(true);
        if (selectedAssignment && selectedAssignment.id === assignmentId) {
            setLoadingAssignments(false);
            return;
        }

        const assignment = assignments.find((a) => a.id === assignmentId);
        if (!assignment) return;

        setSelectedAssignment(assignment);

        setLoadingAssignments(false);
    };

    return (
        <div className="container">
            <SideWindow
                chats={chats}
                loadingChats={loadingChats}
                selectedChat={selectedChat}
                onSelectChat={handleChatSelect}
                assignments={assignments}
                loadingAssignments={loadingAssignments}
                selectedAssignment={selectedAssignment}
                onSelectAssignment={handleAssignmentSelect}
                assignmentStatus={assignmentStatus}
                setAssignmentStatus={setAssignmentStatus}
                user={user}
                onSignOut={handleSignOut}
            />
            {!loadingChats && !chatsError && selectedChat && (
                <ChatWindow
                    messages={messages}
                    selectedChat={selectedChat}
                    onNewMessage={handleNewMessage}
                    loadingMessages={loadingMessages}
                />
            )}
        </div>
    );
};

export default Dashboard;
