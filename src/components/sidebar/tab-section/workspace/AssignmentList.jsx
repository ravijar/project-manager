import {useState} from "react";
import ChipSection from "../../../common/chip-section/ChipSection.jsx";
import SearchBar from "../../../common/search-bar/SearchBar.jsx";
import LoadingSpinner from "../../../common/loading-spinner/LoadingSpinner.jsx";
import RoleBased from "../../../common/RoleBased.js";
import Popup from "../../../common/popup/Popup.jsx";
import AddAssignment from "./popup/new-assignment/AddAssignment.jsx";
import AssignmentCard from "./parts/AssignmentCard.jsx";
import "./AssignmentList.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

const AssignmentList = (
    {
        assignmentChats,
        loading,
        selectedAssignmentChat,
        onSelectAssignmentChat,
        user,
    }
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);

    const openAssignmentPopup = () => setShowAssignmentPopup(true);
    const closeAssignmentPopup = () => setShowAssignmentPopup(false);
    const [selectedType, setSelectedType] = useState(null);

    const filteredAssignmentChats = assignmentChats.filter((assignmentChat) => {
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch = assignmentChat.assignment?.name?.toLowerCase().includes(lowerSearch);
        const matchesType = assignmentChat.assignment?.status === selectedType;

        return matchesSearch && matchesType;
    });

    return (
        <div className="assignment-list-container">
            <div className="assignment-list-header">
                <ChipSection
                    chips={[
                        {label: "Ongoing", value: "ongoing"},
                        {label: "Completed", value: "completed"},
                        {label: "Ignored", value: "ignored"},
                    ]}
                    activeValue={selectedType}
                    setActiveValue={setSelectedType}
                />

                <div className="assignment-icons">
                    <RoleBased roles={["student"]} currentRole={user.role}>
                        <div className="icon-button" onClick={openAssignmentPopup} title="New Assignment">
                            <FontAwesomeIcon icon={faAdd}/>
                        </div>
                    </RoleBased>
                    {loading && <LoadingSpinner size={16} color="#4285f4"/>}
                </div>
            </div>

            <div className="assignment-list-search">
                <SearchBar value={searchTerm} onChange={setSearchTerm}/>
            </div>

            <div className="assignment-list-scroll">
                {filteredAssignmentChats.map((assignmentChat) => (
                    <AssignmentCard
                        key={assignmentChat.chatId}
                        assignmentChatId={assignmentChat.chatId}
                        name={assignmentChat.assignment?.name}
                        field={assignmentChat.assignment?.field}
                        dueBy={assignmentChat.assignment?.dueBy}
                        onClick={onSelectAssignmentChat}
                        selected={selectedAssignmentChat && selectedAssignmentChat.chatId === assignmentChat.chatId}
                        hasUnread={assignmentChat?.lastRead < assignmentChat?.lastTimestamp}
                    />
                ))}
            </div>

            {showAssignmentPopup && (
                <Popup onClose={closeAssignmentPopup} width="400px">
                    <AddAssignment user={user} onClose={closeAssignmentPopup}/>
                </Popup>
            )}
        </div>
    );
};

export default AssignmentList;
