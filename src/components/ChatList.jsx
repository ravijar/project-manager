import { useState } from 'react';
import './ChatList.css';
import SearchBar from './SearchBar';
import Chat from './Chat';
import Profile from './Profile';

const ChatList = ({ chats, onSelectChat, user, onSignOut }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list">
      <Profile user={user} onSignOut={onSignOut}/>
      <div className="chat-list-header">
        Chats
      </div>
      <div className="chat-list-search">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="chat-list-scroll">
        {filteredChats.map((chat) => (
          <Chat
            key={chat.id}
            chatId={chat.id}
            height={60}
            avatarSrc={chat.avatarSrc}
            name={chat.name}
            onChatClick ={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
