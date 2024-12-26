import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Home.css';
import { useState, useEffect } from 'react';
import { getChatsForCurrentUser, getMessagesForChat, addMessageToChat } from '../firebase/chatService';

const Home = ({ user, handleSignOut }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError("");
      const userChats = await getChatsForCurrentUser(user.uid);
      setChats(userChats);
      if (userChats.length > 0) {
        handleChatSelect(userChats[0].chatId);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatId) => {
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
      />
      {!loading && !error && selectedChat && (
        <ChatWindow 
        messages={messages} 
        selectedChat={selectedChat}
        onNewMessage={handleNewMessage}
      />
      )}
    </div>
  );
};

export default Home;
