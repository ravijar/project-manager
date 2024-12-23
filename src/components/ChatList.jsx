import { useState } from 'react';
import './ChatList.css';
import SearchBar from './SearchBar';
import Chat from './Chat';

const ChatList = ({ chats }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list">
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
            height={60}
            avatarSrc={chat.avatarSrc}
            name={chat.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
