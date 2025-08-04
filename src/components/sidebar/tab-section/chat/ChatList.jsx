import LoadingSpinner from "../../../common/loading-spinner/LoadingSpinner.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../../common/search-bar/SearchBar.jsx";
import ChatCard from "./parts/ChatCard.jsx";
import Popup from "../../../common/popup/Popup.jsx";
import {useState} from "react";
import "./ChatList.css";
import ChipSection from "../../../common/chip-section/ChipSection.jsx";
import RoleBased from "../../../common/RoleBased.js";
import NewChat from "./popup/new-chat/NewChat.jsx";

const ChatList = ({chats, selectedChat, onSelectChat, loadingChats, user}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showChatPopup, setShowChatPopup] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const filteredChats = chats.filter((chat) => {
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch = chat.isGroup
            ? chat.groupName?.toLowerCase().includes(lowerSearch)
            : chat.user?.name?.toLowerCase().includes(lowerSearch);

        const matchesType =
            selectedType === null
                ? true
                : chat.isGroup
                    ? selectedType === "group"
                    : chat.user?.role === selectedType;

        return matchesSearch && matchesType;
    });

    const openChatPopup = () => setShowChatPopup(true);

    const closeChatPopup = () => setShowChatPopup(false);

    return (
        <div className="chat-list-container">
            <div className="chat-list-header">
                <RoleBased roles={["admin"]} currentRole={user.role}>
                    <ChipSection
                        chips={[
                            {label: "All", value: null},
                            {label: "Student", value: "student"},
                            {label: "Tutor", value: "tutor"},
                            {label: "Admin", value: "admin"},
                            {label: "Group", value: "group"},
                        ]}
                        activeValue={selectedType}
                        setActiveValue={setSelectedType}
                    />
                </RoleBased>

                <RoleBased roles={["student", "tutor"]} currentRole={user.role}>
                    <ChipSection
                        chips={[
                            {label: "All", value: null},
                            {label: "Admin", value: "admin"},
                            {label: "Group", value: "group"},
                        ]}
                        activeValue={selectedType}
                        setActiveValue={setSelectedType}
                    />
                </RoleBased>

                <div className="chat-icons">
                    <div className="icon-button" onClick={openChatPopup} title="New ChatCard">
                        <FontAwesomeIcon icon={faAdd}/>
                    </div>
                    {loadingChats && <LoadingSpinner size={16} color="#4285f4"/>}
                </div>
            </div>

            <div className="chat-list-search">
                <SearchBar value={searchTerm} onChange={setSearchTerm}/>
            </div>

            <div className="chat-list-scroll">
                {filteredChats.map((chat) => (
                    <ChatCard
                        key={chat.chatId}
                        chatId={chat.chatId}
                        height={60}
                        avatarSrc={chat.isGroup ? "" : chat.user.photoURL}
                        name={chat.isGroup ? chat.groupName : chat.user?.name}
                        onChatClick={onSelectChat}
                        selected={selectedChat && selectedChat.chatId === chat.chatId}
                        hasUnread={chat?.lastRead < chat?.lastTimestamp}
                    />
                ))}
            </div>

            {showChatPopup && (
                <Popup onClose={closeChatPopup} width="400px">
                    <NewChat currentUser={user} onChatCreated={closeChatPopup}/>
                </Popup>
            )}
        </div>
    )
}

export default ChatList;