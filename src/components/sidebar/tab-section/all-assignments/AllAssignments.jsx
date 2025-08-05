import React, { useState, useEffect } from 'react';
import { fetchAllAssignments } from '../../../../services/assignmentService.js';
import './AllAssignments.css';

const AllAssignments = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div className="all-assignments">
                <div className="loading">Loading assignments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="all-assignments">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="all-assignments">
            <div className="assignments-header">
                <h3>All Assignments</h3>
                <span className="assignment-count">{assignments.length} assignments</span>
            </div>
            
            <div className="assignments-list">
                {assignments.length === 0 ? (
                    <div className="no-assignments">No assignments found.</div>
                ) : (
                    assignments.map((assignment) => (
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
    );
};

export default AllAssignments; 