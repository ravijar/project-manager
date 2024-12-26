import SideWindow from '../components/sidebar/SideWindow';
import ChatWindow from '../components/container/ChatWindow';
import './Home.css';
import { useState, useEffect } from 'react';
import { getChatsForCurrentUser } from '../firebase/chatService';

const testMessages = [
  { text: "Hey there!", time: "10:30 AM", isSender: false, date: "June 5, 2023" },
  { text: "Hi! How are you?", time: "10:31 AM", isSender: true, date: "June 5, 2023" },
  { text: "I'm doing great, thanks! How about you?", time: "10:32 AM", isSender: false, date: "June 5, 2023" },
  { text: "Doing well too! Had a busy day.", time: "10:33 AM", isSender: true, date: "June 5, 2023" },
  { text: "I can relate to that. It's been hectic.", time: "10:34 AM", isSender: false, date: "June 5, 2023" },
  { text: "By the way, did you check out the new update?", time: "10:35 AM", isSender: true, date: "June 5, 2023" },
  { text: "Not yet! Is it any good?", time: "10:36 AM", isSender: false, date: "June 5, 2023" },
  { text: "Absolutely! Lots of new features.", time: "10:37 AM", isSender: true, date: "June 5, 2023" },
  { text: "Nice! I'll check it out later today.", time: "10:38 AM", isSender: false, date: "June 5, 2023" },
  { text: "Cool! Let me know what you think.", time: "10:39 AM", isSender: true, date: "June 5, 2023" },
  { text: "Good morning! Hope you’re doing well.", time: "9:00 AM", isSender: false, date: "June 6, 2023" },
  { text: "Good morning! I'm doing great. What about you?", time: "9:05 AM", isSender: true, date: "June 6, 2023" },
  { text: "Feeling good. Busy day ahead though!", time: "9:10 AM", isSender: false, date: "June 6, 2023" },
  { text: "Same here. Let's catch up later.", time: "9:15 AM", isSender: true, date: "June 6, 2023" },
  { text: "Sure! Have a great day!", time: "9:20 AM", isSender: false, date: "June 6, 2023" },
  { text: "Hey! Did you finish the project?", time: "2:00 PM", isSender: true, date: "June 7, 2023" },
  { text: "Almost done! Just need a few more hours.", time: "2:10 PM", isSender: false, date: "June 7, 2023" },
  { text: "Awesome. Let me know if you need help.", time: "2:15 PM", isSender: true, date: "June 7, 2023" },
  { text: "Thanks! Will do.", time: "2:20 PM", isSender: false, date: "June 7, 2023" },
  { text: "Hey, are you free to meet tomorrow?", time: "7:00 PM", isSender: true, date: "June 7, 2023" },
  { text: "Yeah, I can make it. What time works for you?", time: "7:05 PM", isSender: false, date: "June 7, 2023" },
  { text: "How about 3 PM?", time: "7:10 PM", isSender: true, date: "June 7, 2023" },
  { text: "Perfect. See you then!", time: "7:15 PM", isSender: false, date: "June 7, 2023" },
];

const Home = ({ user, handleSignOut }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState(testMessages);

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
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatId) => {
    const chat = chats.find((c) => c.chatId === chatId);
    setSelectedChat(chat);
  };

  const handleNewMessage = (newMessage) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, time: currentTime, isSender: true, date: "June 5, 2023" },
    ]);
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
