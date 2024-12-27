import React, { useState } from "react";
import SearchBar from "../common/SearchBar";
import Chat from "./Chat";
import "./FindUser.css";
import LoadingSpinner from "../common/LoadingSpinner";
import { findNewUsers } from "../../services/userService";
import { createNewPrivateChat } from "../../services/chatService";

const FindUser = ({ currentUser, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      try {
        setError("");
        setSearchResults(null);
        setLoading(true);

        const users = await findNewUsers(currentUser.uid, "email", searchTerm.trim());
        if (users.length > 0) {
          setSearchResults(users);
        } else {
          setError("No new users found with this email!");
        }
      } catch (err) {
        console.error("Error finding user:", err);
        setError("An error occurred while searching for the user.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResultClick = async (user) => {
    if (user) {
      setLoading(true);
      try {
        const chatId = await createNewPrivateChat(currentUser, user);
        onChatCreated(chatId);
      } catch (error) {
        console.error("Failed to create chat. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="find-user-container">
      <div className="find-user-header">
        Find User
        {loading && <LoadingSpinner size={18} color="#3498db" />}
      </div>
      <div className="search-bar-container">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onKeyDown={handleSearch}
          placeholder="Enter email to search"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {searchResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <Chat
              key={user.uid}
              chatId={user.uid}
              avatarSrc={user.photoURL}
              name={user.name}
              onChatClick={() => handleResultClick(user)}
              height={60}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindUser;
