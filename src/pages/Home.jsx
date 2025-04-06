import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Home.css';
import {useState, useEffect} from 'react';
import {sendMessage} from '../services/messageService';
import {syncMessages} from '../services/messageService';
import {syncChats} from '../services/chatService';

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


    const handleChatSelect = (chatId) => {
        setLoadingMessages(true);
        setMessages([]);
        if (unsubscribe) {
            unsubscribe();
        }

        const chat = chats.find((c) => c.chatId === chatId);
        setSelectedChat(chat);

        const unsubscribeFunction = syncMessages(chatId, (fetchedMessages) => {
            const formattedMessages = fetchedMessages.map((msg) => ({
                text: msg.message,
                time: new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                isSender: msg.sender === user.uid,
                date: new Date(msg.timestamp.toDate()).toLocaleDateString(),
            }));
            setMessages(formattedMessages);
        });

        setUnsubscribe(() => unsubscribeFunction);
        setLoadingMessages(false);
    };

    const handleNewMessage = async (newMessage) => {
        if (!selectedChat) {
            console.error("No chat selected.");
            return;
        }

        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
        const formattedDate = currentTime.toLocaleDateString();

        setMessages((prevMessages) => [
            ...prevMessages,
            {text: newMessage, time: formattedTime, isSender: true, date: formattedDate},
        ]);

        try {
            await sendMessage(selectedChat.chatId, user.uid, newMessage);
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
