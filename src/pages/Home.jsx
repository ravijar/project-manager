import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Home.css';
import { useState, useEffect } from 'react';
import { getChatsForCurrentUser, getMessagesForChat, addMessageToChat } from '../firebase/chatService';

const Home = ({ user, handleSignOut }) => {
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
  
    const unsubscribe = getChatsForCurrentUser(user.uid, (updatedChats) => {
      setChats(updatedChats);
      if (updatedChats.length > 0) {
        setSelectedChat(updatedChats[0]);
        handleChatSelect(updatedChats[0].chatId);
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

    const unsubscribeFunction = getMessagesForChat(chatId, (fetchedMessages) => {
      const formattedMessages = fetchedMessages.map((msg) => ({
        text: msg.message,
        time: new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const formattedDate = currentTime.toLocaleDateString();
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, time: formattedTime, isSender: true, date: formattedDate },
    ]);
  
    try {
      await addMessageToChat(selectedChat.chatId, user.uid, newMessage);
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
      />
      {!loadingChats && !error && (
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
