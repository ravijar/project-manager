import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from "../../../common/search-bar/SearchBar.jsx";
import ChipSection from "../../../common/chip-section/ChipSection.jsx";
import RoleBased from "../../../common/RoleBased.js";
import { fetchAllAssignments } from '../../../../services/assignmentService.js';
import './AllAssignments.css';

const AllAssignments = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');

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

    // Extract unique fields for chip options
    const uniqueFields = useMemo(() => {
        const fields = [...new Set(assignments.map(assignment => assignment.field))];
        const fieldOptions = fields.filter(field => field).map(field => ({
            value: field,
            label: field
        }));
        
        // Add "All" option at the beginning
        return [
            { value: 'all', label: 'All' },
            ...fieldOptions
        ];
    }, [assignments]);

    // Filter assignments based on search term and selected field
    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            const lowerSearch = searchTerm.toLowerCase();

            // Search filter - check name, field, and description
            const matchesSearch = 
                assignment.name?.toLowerCase().includes(lowerSearch) ||
                assignment.field?.toLowerCase().includes(lowerSearch) ||
                assignment.description?.toLowerCase().includes(lowerSearch);

            // Field type filter
            const matchesType = 
                !selectedType || selectedType === 'all' || selectedType === ''
                    ? true 
                    : assignment.field === selectedType;

            return matchesSearch && matchesType;
        });
    }, [assignments, searchTerm, selectedType]);

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
                    {/* Search and Filter Section */}
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
                                <div key={assignment.id} className="assignment-item">
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
                                            <p><strong>Due:</strong> {assignment.dueBy.toDate?.() ? assignment.dueBy.toDate().toLocaleDateString() : assignment.dueBy}</p>
                                        )}
                                        {assignment.description && (
                                            <p className="description"><strong>Description:</strong> {assignment.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </RoleBased>
    );
};

export default AllAssignments; 