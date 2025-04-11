import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Home.css';
import {useState, useEffect} from 'react';
import {sendMessage} from '../services/messageService';
import {syncMessages} from '../services/messageService';
import {syncChats, selectChat} from '../services/chatService';

const Home = ({user, handleSignOut}) => {
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        const cleanup = fetchChats();

        return () => {
            if (cleanup) cleanup();
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
        if (!user?.uid) return;

        setLoadingChats(true);
        setError("");

        const unsubscribe = syncChats(user.uid, (updateFnOrChats) => {
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

        const unsub = await selectChat(chatId, user.uid, (fetchedMessages) => {
            setMessages(formatMessages(fetchedMessages, user.uid));
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
            await sendMessage(selectedChat.chatId, user.uid, newMessage, isFile);
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.text !== newMessage));
        }
    };

    return (
        <div className="container">
            <SideWindow
                chats={chats}
                onSelectChat={handleChatSelect}
                user={user}
                onSignOut={handleSignOut}
                loadingChats={loadingChats}
                selectedChat={selectedChat}
            />
            {!loadingChats && !error && selectedChat && (
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

export default Home;
