import React, {useState, useEffect} from "react";
import SearchBar from "../common/SearchBar";
import "./FindUser.css";
import LoadingSpinner from "../common/LoadingSpinner";
import {findNewUsers} from "../../services/userService";
import {createNewPrivateChat} from "../../services/chatService";
import ChipSection from "../common/ChipSection";
import RoleBased from "../common/RoleBased.js";
import UserDetailsCard from "./UserDetailsCard";

const FindUser = ({currentUser, onChatCreated}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {
        setSearchResults(null);
        setSearchTerm("")
    }, [selectedRole, selectedField])

    const handleSearch = async (event) => {
        if (event.key === "Enter" && searchTerm.trim()) {
            try {
                setError("");
                setSearchResults(null);
                setLoading(true);

                const users = await findNewUsers(
                    currentUser.id,
                    selectedRole,
                    selectedField,
                    searchTerm.trim()
                );

                if (users.length > 0) {
                    setSearchResults(users);
                } else {
                    setError("No users found!");
                }
            } catch (err) {
                console.error("Error finding users:", err);
                setError("An error occurred while searching for users.");
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
                {loading && <LoadingSpinner size={12} color="#3498db"/>}
            </div>

            <div className="chip-section-title">Role</div>
            <RoleBased roles={["admin"]} currentRole={currentUser.role}>
                <ChipSection
                    chips={[
                        { label: "Student", value: "student" },
                        { label: "Tutor", value: "tutor" },
                        { label: "Admin", value: "admin" },
                    ]}
                    activeValue={selectedRole}
                    setActiveValue={setSelectedRole}
                />
            </RoleBased>

            <RoleBased roles={["student", "tutor"]} currentRole={currentUser.role}>
                <ChipSection
                    chips={[{ label: "Admin", value: "admin" }]}
                    activeValue={selectedRole}
                    setActiveValue={setSelectedRole}
                />
            </RoleBased>

            <div className="chip-section-title">Field</div>
            <ChipSection
                chips={[
                    { label: "Name", value: "name" },
                    { label: "Email", value: "email" },
                ]}
                activeValue={selectedField}
                setActiveValue={setSelectedField}
            />

            <div className="search-bar-container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onKeyDown={handleSearch}
                    placeholder="Enter search term"
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            {searchResults && searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                        <UserDetailsCard
                            key={user.id}
                            name={user.name}
                            email={user.email}
                            role={user.role}
                            avatarSrc={user.photoURL}
                            onClick={() => handleResultClick(user)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindUser;
