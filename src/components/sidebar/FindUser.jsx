import React, { useState } from "react";
import { findUserByEmail } from "../../firebase/userService";
import { createChat } from "../../firebase/chatService";
import SearchBar from "../common/SearchBar";
import Chat from "./Chat";
import "./FindUser.css";

const FindUser = ({ currentUser, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      try {
        setError("");
        setSearchResult(null);

        const user = await findUserByEmail(searchTerm.trim());
        if (user) {
          setSearchResult(user);
        } else {
          setError("No user found with this email.");
        }
      } catch (err) {
        console.error("Error finding user:", err);
        setError("An error occurred while searching for the user.");
      }
    }
  };

  const handleResultClick = async () => {
    if (searchResult) {
      try {
        const chatId = await createChat(currentUser, searchResult);
        console.log("Chat created with ID:", chatId);
        onChatCreated(chatId);
      } catch (error) {
        console.error("Failed to create chat. Please try again.");
      }
    }
  };

  return (
    <div className="find-user-container">
      <div className="find-user-header">Find User</div>
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
