import {useState} from 'react';
import './SideWindow.css';
import SearchBar from '../common/SearchBar';
import Chat from './Chat';
import Profile from './Profile';
import Popup from '../common/Popup';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faFileAlt} from "@fortawesome/free-solid-svg-icons";
import FindUser from './FindUser';
import LoadingSpinner from '../common/LoadingSpinner';
import AddAssignment from './AddAssignment'
import RoleBased from "../common/RoleBased";

const SideWindow = ({chats, onSelectChat, user, onSignOut, loadingChats, selectedChat}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showChatPopup, setShowChatPopup] = useState(false);
    const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);

    const filteredChats = chats.filter((chat) =>
        chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAssignmentPopup = () => setShowAssignmentPopup(true);

    const closeAssignmentPopup = () => setShowAssignmentPopup(false)

    const openChatPopup = () => setShowChatPopup(true);

    const closeChatPopup = () => setShowChatPopup(false);

    return (
        <div className="chat-list">
            <Profile user={user} onSignOut={onSignOut}/>
            <div className="chat-list-header">
                <span className="chats-label">
                  Chats
                    {loadingChats && <LoadingSpinner size={18} color="#4caf50"/>}
                </span>
                <div className="chat-icons">
                    <div className="icon-button" onClick={openChatPopup} title="New Chat">
                        <FontAwesomeIcon icon={faAdd}/>
                    </div>
                    <RoleBased roles={["student"]} currentRole={user.role}>
                        <div className="icon-button" onClick={openAssignmentPopup} title="New Assignment">
                            <FontAwesomeIcon icon={faFileAlt}/>
                        </div>
                    </RoleBased>
                </div>
            </div>
            <div className="chat-list-search">
                <SearchBar value={searchTerm} onChange={setSearchTerm}/>
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
                        selected={selectedChat && selectedChat.chatId === chat.chatId}
                        hasUnread={chat?.lastRead < chat?.lastTimestamp}
                    />
                ))}
            </div>

            {showChatPopup && (
                <Popup onClose={closeChatPopup} width="300px">
                    <FindUser currentUser={user} onChatCreated={closeChatPopup}/>
                </Popup>
            )}

            {showAssignmentPopup && (
                <Popup onClose={closeAssignmentPopup} width="400px">
                    <AddAssignment userId={user.id} onClose={closeAssignmentPopup}/>
                </Popup>
            )}
        </div>
    );
};

export default SideWindow;
