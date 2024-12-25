import { useState } from 'react';
import './SideWindow.css';
import SearchBar from '../common/SearchBar';
import Chat from './Chat';
import Profile from './Profile';
import Popup from '../common/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import FindUser from './FindUser';

const ChatList = ({ chats, onSelectChat, user, onSignOut }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChatClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="chat-list">
      <Profile user={user} onSignOut={onSignOut}/>
      <div className="chat-list-header">
        <span className="chats-label">Chats</span>
        <div className="new-chat-icon" onClick={handleNewChatClick}>
            <FontAwesomeIcon icon={faAdd} />
        </div>
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
            onChatClick={onSelectChat}
          />
        ))}
      </div>
      {showPopup && (
        <Popup onClose={closePopup} width="300px">
          <FindUser />
        </Popup>
      )}
    </div>
  );
};

export default ChatList;
