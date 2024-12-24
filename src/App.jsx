import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';
import { useState } from 'react';

const App = () => {
  const chats = [
    { id: 1, name: 'John Doe', avatarSrc: 'https://i.pravatar.cc/50?img=1' },
    { id: 2, name: 'Jane Smith', avatarSrc: 'https://i.pravatar.cc/50?img=2' },
    { id: 3, name: 'Alice Johnson', avatarSrc: 'https://i.pravatar.cc/50?img=3' },
    { id: 4, name: 'Bob Brown', avatarSrc: 'https://i.pravatar.cc/50?img=4' },
    { id: 5, name: 'Charlie Davis', avatarSrc: 'https://i.pravatar.cc/50?img=5' },
    { id: 6, name: 'Emily Wilson', avatarSrc: 'https://i.pravatar.cc/50?img=6' },
    { id: 7, name: 'George Miller', avatarSrc: 'https://i.pravatar.cc/50?img=7' },
    { id: 8, name: 'Hannah Moore', avatarSrc: 'https://i.pravatar.cc/50?img=8' },
    { id: 9, name: 'Ian Taylor', avatarSrc: 'https://i.pravatar.cc/50?img=9' },
    { id: 10, name: 'Jessica Thomas', avatarSrc: 'https://i.pravatar.cc/50?img=10' },
    { id: 11, name: 'Kevin Harris', avatarSrc: 'https://i.pravatar.cc/50?img=11' },
    { id: 12, name: 'Laura Clark', avatarSrc: 'https://i.pravatar.cc/50?img=12' },
    { id: 13, name: 'Michael Lee', avatarSrc: 'https://i.pravatar.cc/50?img=13' },
    { id: 14, name: 'Natalie White', avatarSrc: 'https://i.pravatar.cc/50?img=14' },
    { id: 15, name: 'Oliver King', avatarSrc: 'https://i.pravatar.cc/50?img=15' },
    { id: 16, name: 'Penelope Adams', avatarSrc: 'https://i.pravatar.cc/50?img=16' },
    { id: 17, name: 'Quinn Baker', avatarSrc: 'https://i.pravatar.cc/50?img=17' },
    { id: 18, name: 'Rachel Carter', avatarSrc: 'https://i.pravatar.cc/50?img=18' },
    { id: 19, name: 'Samuel Scott', avatarSrc: 'https://i.pravatar.cc/50?img=19' },
    { id: 20, name: 'Taylor Young', avatarSrc: 'https://i.pravatar.cc/50?img=20' },
  ];

  const messages = [
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
  
  const [selectedChat, setSelectedChat] = useState(chats[0]);

  const handleChatSelect = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setSelectedChat(chat);
  };

  return (
    <div style={{ display: 'flex', width: '100vw' }}>
      <ChatList chats={chats} onSelectChat={handleChatSelect}/>
      <ChatWindow messages={messages} chatUser={selectedChat}/>
    </div>
  );
};

export default App;
