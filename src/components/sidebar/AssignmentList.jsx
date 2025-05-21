import {useState} from "react";
import ChipSection from "../common/ChipSection.jsx";
import SearchBar from "../common/SearchBar.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import RoleBased from "../common/RoleBased.js";
import Popup from "../common/Popup.jsx";
import AddAssignment from "./AddAssignment.jsx";
import AssignmentCard from "./AssignmentCard.jsx";
import "./AssignmentList.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

const AssignmentList = (
    {
        assignments,
        loading,
        selectedAssignmentId,
        onSelectAssignment,
        selectedStatus,
        setSelectedStatus,
        user,
    }
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);

    const openAssignmentPopup = () => setShowAssignmentPopup(true);
    const closeAssignmentPopup = () => setShowAssignmentPopup(false);

    const filteredAssignments = assignments
        .filter((assignment) =>
            assignment.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="assignment-list-container">
            <div className="assignment-list-header">
                <ChipSection
                    chips={[
                        {label: "Ongoing", value: "new"},
                        {label: "Completed", value: "completed"},
                        {label: "Ignored", value: "ignored"},
                    ]}
                    activeValue={selectedStatus}
                    setActiveValue={setSelectedStatus}
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
                {filteredAssignments.map((assignment) => (
                    <AssignmentCard
                        key={assignment.id}
                        name={assignment.name}
                        field={assignment.field}
                        dueBy={assignment.dueBy}
                        selected={assignment.id === selectedAssignmentId}
                        onClick={() => onSelectAssignment(assignment.id)}
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
