import { useState } from 'react';
import './SideWindow.css';
import SearchBar from '../common/SearchBar';
import Chat from './Chat';
import Profile from './Profile';
import Popup from '../common/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import FindUser from './FindUser';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatList = ({ chats, onSelectChat, user, onSignOut, loadingChats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <span className="chats-label">
          Chats
          {loadingChats && <LoadingSpinner size={18} color="#4caf50" />}
        </span>
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
            key={chat.chatId}
            chatId={chat.chatId}
            height={60}
            avatarSrc={chat.user.photoURL}
            name={chat.user.name}
            onChatClick={onSelectChat}
          />
        ))}
      </div>
      {showPopup && (
        <Popup onClose={closePopup} width="300px">
          <FindUser currentUser={user} onChatCreated={closePopup}/>
        </Popup>
      )}
    </div>
  );
};

export default ChatList;
