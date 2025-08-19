import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from "../../../common/search-bar/SearchBar.jsx";
import ChipSection from "../../../common/chip-section/ChipSection.jsx";
import RoleBased from "../../../common/RoleBased.js";
import {
    fetchAllAssignments,
    assignAdminToAssignment,
    assignTutorToAssignment,
    addBidToAssignment,
    updateAssignmentSubStatus
} from '../../../../services/assignmentService.js';
import AdminAssignmentPopup from "./assignments-popup/AdminAssignmentPopup.jsx";
import TutorAssignmentPopup from "./assignments-popup/TutorAssignmentPopup.jsx";
import './AllAssignments.css';

const AllAssignments = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const [isAssigning, setIsAssigning] = useState(false);
    const [isBidding, setIsBidding] = useState(false);
    const [isMarkingBidding, setIsMarkingBidding] = useState(false); // NEW

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                setLoading(true);
                const assignmentsData = await fetchAllAssignments();
                setAssignments(assignmentsData);
            } catch (err) {
                setError('Failed to load assignments');
                console.error('Error loading assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAssignments();
    }, []);

    const uniqueFields = useMemo(() => {
        const fields = [...new Set(assignments.map(assignment => assignment.field))];
        const fieldOptions = fields.filter(field => field).map(field => ({
            value: field,
            label: field
        }));

        return [
            { value: 'all', label: 'All' },
            ...fieldOptions
        ];
    }, [assignments]);

    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            const lowerSearch = searchTerm.toLowerCase();

            const matchesSearch =
                assignment.name?.toLowerCase().includes(lowerSearch) ||
                assignment.field?.toLowerCase().includes(lowerSearch) ||
                assignment.description?.toLowerCase().includes(lowerSearch);

            const matchesType =
                !selectedType || selectedType === 'all' || selectedType === ''
                    ? true
                    : assignment.field === selectedType;

            return matchesSearch && matchesType;
        });
    }, [assignments, searchTerm, selectedType, user.role]);

    const handleAssignmentClick = (assignment) => {
        setSelectedAssignment(assignment);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedAssignment(null);
    };

    // ADMIN: Self-assign — service returns the updated assignment; keep popup open.
    const handleSelfAssign = async (assignment) => {
        try {
            setIsAssigning(true);

            // Service MUST return the updated assignment (with admin + subStatus)
            const updated = await assignAdminToAssignment(assignment.id, user.id);

            // Update list
            setAssignments((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
            );

            // Update the open popup object so UI shows "Enable Bidding"
            setSelectedAssignment((prev) =>
                prev?.id === updated.id ? updated : prev
            );

            console.log(
                `Admin ${user.id} assigned; subStatus → ${updated.subStatus} for ${updated.id}`
            );
        } catch (err) {
            console.error("Self-assign failed:", err);
        } finally {
            setIsAssigning(false);
            // Do NOT close the popup here
        }
    };


    // TUTOR: Place bid (unchanged)
    const handlePlaceBid = async (assignment, amount) => {
        try {
            const value = Number(amount);
            if (!Number.isFinite(value) || value <= 0) {
                console.error("Invalid bid amount:", amount);
                return;
            }

            setIsBidding(true);
            await addBidToAssignment(assignment.id, user.id, value);

            setAssignments((prev) =>
                prev.map((a) => {
                    if (a.id !== assignment.id) return a;

                    const prevBidders = Array.isArray(a.bidders) ? a.bidders : [];
                    const existingIdx = prevBidders.findIndex(
                        (b) => b.bidderId === user.id
                    );

                    let nextBidders;
                    if (existingIdx >= 0) {
                        nextBidders = [...prevBidders];
                        nextBidders[existingIdx] = { bidderId: user.id, bid: value };
                    } else {
                        nextBidders = [...prevBidders, { bidderId: user.id, bid: value }];
                    }

                    return { ...a, bidders: nextBidders };
                })
            );
        } catch (err) {
            console.error("Place bid failed:", err);
        } finally {
            setIsBidding(false);
            handleClosePopup();
        }
    };

    // ADMIN: Enable bidding → subStatus: 'bidding' (keep popup open is fine)
    const handleMarkBidding = async (assignment) => {
        try {
            setIsMarkingBidding(true);
            await updateAssignmentSubStatus(assignment.id, "bidding");

            setAssignments((prev) =>
                prev.map((a) =>
                    a.id === assignment.id ? { ...a, subStatus: "bidding" } : a
                )
            );

            // reflect in the open popup
            setSelectedAssignment((prev) =>
                prev && prev.id === assignment.id
                    ? { ...prev, subStatus: "bidding" }
                    : prev
            );

            console.log(`SubStatus → bidding for ${assignment.id}`);
        } catch (err) {
            console.error("Failed to update subStatus:", err);
        } finally {
            setIsMarkingBidding(false);
        }
    };

    return (
        <RoleBased roles={["admin", "tutor"]} currentRole={user.role}>
            {loading ? (
                <div className="all-assignments">
                    <div className="loading">Loading assignments...</div>
                </div>
            ) : error ? (
                <div className="all-assignments">
                    <div className="error">{error}</div>
                </div>
            ) : (
                <div className="all-assignments">
                    <div className="filters-section">
                        {uniqueFields.length > 0 && (
                            <ChipSection
                                chips={uniqueFields}
                                activeValue={selectedType}
                                setActiveValue={setSelectedType}
                            />
                        )}
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search assignments..."
                        />
                    </div>

                    <div className="assignments-list">
                        {filteredAssignments.length === 0 ? (
                            <div className="no-assignments">
                                {assignments.length === 0
                                    ? "No assignments found."
                                    : "No assignments match your search criteria."
                                }
                            </div>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="assignment-item clickable"
                                    onClick={() => handleAssignmentClick(assignment)}
                                >
                                    <div className="assignment-header">
                                        <h4>{assignment.name}</h4>
                                        <span className={`status-badge ${assignment.status}`}>
                                            {assignment.status}
                                        </span>
                                    </div>

                                    <div className="assignment-details">
                                        <p><strong>Field:</strong> {assignment.field}</p>
                                        <p><strong>Sub Status:</strong> {assignment.subStatus}</p>
                                        {assignment.dueBy && (
                                            <p>
                                                <strong>Due:</strong>{" "}
                                                {assignment.dueBy.toDate?.()
                                                    ? assignment.dueBy.toDate().toLocaleDateString()
                                                    : assignment.dueBy}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Role-based popups */}
            {showPopup && selectedAssignment && (
                user.role === "admin" ? (
                    <AdminAssignmentPopup
                        assignment={selectedAssignment}
                        onClose={handleClosePopup}
                        onSelfAssign={handleSelfAssign}
                        onMarkBidding={handleMarkBidding}
                        isAssigning={isAssigning}
                        isMarkingBidding={isMarkingBidding} // NEW
                    />
                ) : (
                    <TutorAssignmentPopup
                        assignment={selectedAssignment}
                        onClose={handleClosePopup}
                        onBid={handlePlaceBid}
                        isBidding={isBidding}
                    />
                )
            )}
        </RoleBased>
    );
};

export default AllAssignments;
