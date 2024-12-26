import React, { useState } from "react";
import { findNewUserByEmail } from "../../firebase/userService";
import { createChat } from "../../firebase/chatService";
import SearchBar from "../common/SearchBar";
import Chat from "./Chat";
import "./FindUser.css";
import LoadingSpinner from "../common/LoadingSpinner";

const FindUser = ({ currentUser, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      try {
        setError("");
        setSearchResult(null);
        setLoading(true);

        const user = await findNewUserByEmail(searchTerm.trim(), currentUser.uid);
        if (user) {
          setSearchResult(user);
        } else {
          setError("No new user found with this email!");
        }
      } catch (err) {
        console.error("Error finding user:", err);
        setError("An error occurred while searching for the user.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResultClick = async () => {
    if (searchResult) {
      setLoading(true);
      try {
        const chatId = await createChat(currentUser, searchResult);
        console.log("Chat created with ID:", chatId);
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
      {searchResult && (
        <Chat
          chatId={searchResult.id}
          avatarSrc={searchResult.photoURL}
          name={searchResult.name}
          onChatClick={handleResultClick}
          height={60}
        />
      )}
    </div>
  );
};

export default FindUser;
