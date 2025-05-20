import React, {useState, useEffect} from "react";
import SearchBar from "../common/SearchBar";
import "./FindUser.css";
import LoadingSpinner from "../common/LoadingSpinner";
import {findNewUsers, findUsers} from "../../services/userService";
import ChipSection from "../common/ChipSection";
import RoleBased from "../common/RoleBased.js";
import UserDetailsCardSection from "./UserDetailsCardSection.jsx";

const FindUser = ({ currentUser, onUserSelected, isGroupChat }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {
        setSearchResults(null);
        setSearchTerm("");
    }, [selectedRole, selectedField, isGroupChat]);

    useEffect(() => {
        if (error) {
            setError("");
        }
    }, [searchTerm]);

    const handleSearch = async (event) => {
        if (event.key === "Enter" && searchTerm.trim()) {
            try {
                setError("");
                setSearchResults(null);
                setLoading(true);

                const users = isGroupChat
                    ? await findUsers(currentUser.id, selectedRole, selectedField, searchTerm.trim())
                    : await findNewUsers(currentUser.id, selectedRole, selectedField, searchTerm.trim());

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

    const handleResultClick = (user) => {
        if (user && onUserSelected) {
            onUserSelected(user);

            setSearchResults((prev) => {
                const updated = prev?.filter((u) => u.id !== user.id) || [];

                if (updated.length === 0) {
                    setSearchTerm("");
                }

                return updated;
            });
        }
    };

    return (
        <>
            <div className="find-user-header">
                Find Users:
                {loading && <LoadingSpinner size={8} color="#3498db"/>}
            </div>
            <div className="find-user-container">
                <div className="chip-section-row">
                    <div className="chip-section-title">Role</div>
                    <div className="chip-section-content">
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
                    </div>
                </div>

                <div className="chip-section-row">
                    <div className="chip-section-title">Field</div>
                    <div className="chip-section-content">
                        <ChipSection
                            chips={[
                                { label: "Name", value: "name" },
                                { label: "Email", value: "email" },
                            ]}
                            activeValue={selectedField}
                            setActiveValue={setSelectedField}
                        />
                    </div>
                </div>

                <div className="search-bar-container">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onKeyDown={handleSearch}
                        placeholder="Enter search term"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <UserDetailsCardSection
                    users={searchResults}
                    onUserClick={handleResultClick}
                />
            </div>
        </>
    );
};

export default FindUser;
