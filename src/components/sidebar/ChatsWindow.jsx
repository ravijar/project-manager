import LoadingSpinner from "../common/LoadingSpinner.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faFileAlt} from "@fortawesome/free-solid-svg-icons";
import RoleBased from "../common/RoleBased.js";
import SearchBar from "../common/SearchBar.jsx";
import Chat from "./Chat.jsx";
import Popup from "../common/Popup.jsx";
import FindUser from "./FindUser.jsx";
import AddAssignment from "./AddAssignment.jsx";
import {useState} from "react";
import "./ChatsWindow.css";

const ChatsWindow = ({chats, selectedChat, onSelectChat, loadingChats, user}) => {
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
        <div className="chats-window-container">
            <div className="chats-window-header">
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
            <div className="chats-window-search">
                <SearchBar value={searchTerm} onChange={setSearchTerm}/>
            </div>
            <div className="chats-window-scroll">
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
    )
}

export default ChatsWindow;