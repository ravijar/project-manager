import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Dashboard.css';
import {useState, useEffect} from 'react';
import {sendMessage} from '../services/messageService';
import {syncChats, selectChat} from '../services/chatService';

const Dashboard = ({user, handleSignOut}) => {
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatsError, setChatsError] = useState("");

    const [messages, setMessages] = useState([]);
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
            await sendMessage(selectedChat.chatId, user, newMessage, isFile);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.text !== newMessage));
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
