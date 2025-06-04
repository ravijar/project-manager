import React, {useState} from "react";
import FindUser from "./FindUser";
import {createNewGroupChat, createNewPrivateChat} from "../../services/chatService";
import "./NewChat.css";
import UserDetailsCardSection from "./UserDetailsCardSection.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import RoleBased from "../common/RoleBased.js";

const NewChat = ({currentUser, onChatCreated}) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isGroupChat, setIsGroupChat] = useState(false);
    const [groupName, setGroupName] = useState("");

    const handleUserSelected = (user) => {
        setSelectedUsers((prev) =>
            prev.some((u) => u.id === user.id) ? prev : [...prev, user]
        );
    };

    const removeUserFromList = (selectedUser) => {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    };

    const handleStartChats = async () => {
        setLoading(true);
        try {
            if (isGroupChat && groupName.trim()) {
                await createNewGroupChat(groupName, [currentUser, ...selectedUsers], currentUser);
            } else {
                for (const user of selectedUsers) {
                    await createNewPrivateChat(currentUser, user);
                }
            }
            setSelectedUsers([]);
            onChatCreated();
        } catch (error) {
            console.error("Error starting chat(s):", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupToggle = () => {
        setIsGroupChat(!isGroupChat);
        if (isGroupChat) setGroupName("");
    };

    return (
        <div className="new-chat-container">
            <div className="new-chat-title">
                {loading && <LoadingSpinner size={10} color="#555"/>}
                <span>Create New Chat</span>
            </div>

            <RoleBased roles={["admin"]} currentRole={currentUser.role}>
                <div className="new-chat-group-toggle">
                    <label className="checkbox-label">
                        <span>Group Chat:</span>
                        <input
                            type="checkbox"
                            checked={isGroupChat}
                            onChange={handleGroupToggle}
                        />
                    </label>

                    {isGroupChat && (
                        <input
                            type="text"
                            className="group-name-input"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                        />
                    )}
                </div>
            </RoleBased>

            <FindUser
                currentUser={currentUser}
                onUserSelected={handleUserSelected}
                isGroupChat={isGroupChat}
            />

            {selectedUsers.length > 0 && (
                <>
                    <div className="selected-users-header">Selected Users:</div>
                    <div className="selected-users-section">
                        <UserDetailsCardSection
                            users={selectedUsers}
                            onUserClick={removeUserFromList}
                        />
                    </div>
                    <div className="selected-users-actions">
                        <button onClick={handleStartChats} disabled={loading}>Create</button>
                        <button onClick={onChatCreated} className="cancel-btn" disabled={loading}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewChat;
