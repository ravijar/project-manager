import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import SearchBar from "./SearchBar";
import Chat from "./Chat";
import "./FindUser.css";

const FindUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      try {
        setError("");
        setSearchResult(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", searchTerm.trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setSearchResult({ id: userDoc.id, ...userDoc.data() });
        } else {
          setError("No user found with this email.");
        }
      } catch (err) {
        console.error("Error finding user:", err);
        setError("An error occurred while searching for the user.");
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
          onChatClick={() => console.log("Start chat with:", searchResult)}
          height={60}
        />
      )}
    </div>
  );
};

export default FindUser;
