import React, { useState } from "react";
import FindUser from "./FindUser";
import { createNewPrivateChat } from "../../services/chatService";
import "./NewChat.css";
import UserDetailsCardSection from "./UserDetailsCardSection.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const NewChat = ({ currentUser, onChatCreated }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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
            for (const user of selectedUsers) {
                const chatId = await createNewPrivateChat(currentUser, user);
                onChatCreated(chatId);
            }
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error starting chat(s):", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-chat-container">
            <div className="new-chat-title">
                {loading && <LoadingSpinner size={10} color="#555"/>}
                <span>Create New Chat</span>
            </div>

            <FindUser currentUser={currentUser} onUserSelected={handleUserSelected} />

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
