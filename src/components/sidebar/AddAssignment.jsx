import React, {useEffect, useRef, useState} from "react";
import "./AddAssignment.css";
import {
    deleteFolder,
    getFileNameFromUrl,
    getOriginalFileName,
    uploadFile
} from "../../services/fileService";
import LoadingSpinner from "../common/LoadingSpinner";
import {addNewAssignment, generateAssignmentId} from "../../services/assignmentService.js";

const FIELDS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "History", "Geography"];

const AddAssignment = ({ userId, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        field: "",
        description: "",
        dueBy: "",
        docs: [],
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const assignmentIdRef = useRef("");
    const submittedRef = useRef(false);

    useEffect(() => {
        assignmentIdRef.current = generateAssignmentId();

        return () => {
            if (!submittedRef.current) {
                cleanupUploadedFiles();
            }
        }
    },[])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const url = await uploadFile(file, assignmentIdRef.current);
            setFormData((prev) => ({ ...prev, docs: [...prev.docs, url] }));
        } catch (err) {
            console.error("File upload failed:", err);
            setError("File upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const cleanupUploadedFiles = async () => {
        try {
            await deleteFolder(assignmentIdRef.current);
        } catch (err) {
            console.warn("Failed to cleanup uploads.");
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        await cleanupUploadedFiles();
        setLoading(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.field || !formData.description || !formData.dueBy) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await addNewAssignment(assignmentIdRef.current, formData, userId)
                .then(() => submittedRef.current = true);
            onClose();
        } catch (err) {
            console.error("Failed to add assignment:", err);
            setError("Assignment submission failed.");
            await cleanupUploadedFiles();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-assignment-container">
            <div className="form-title">
                {loading && <LoadingSpinner size={10} color="#555" />}
                <span>Add New Assignment</span>
            </div>

            <input
                type="text"
                name="name"
                placeholder="Assignment Name"
                value={formData.name}
                onChange={handleInputChange}
            />

            <select name="field" value={formData.field} onChange={handleInputChange}>
                <option value="" disabled>Select Field</option>
                {FIELDS.map((field) => (
                    <option key={field} value={field}>{field}</option>
                ))}
            </select>

            <textarea
                name="description"
                placeholder="Assignment Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
            />

            <div className="due-by-wrapper">
                <span className="due-by-label">Due By</span>
                <input
                    type="date"
                    name="dueBy"
                    value={formData.dueBy}
                    onChange={handleInputChange}
                />
            </div>

            <div className="file-upload-wrapper">
                <div className="file-upload-top-row">
                    <span className="upload-label">Relevant Documents</span>
                    <label className="file-upload-button">
                        {uploading ? (
                            <LoadingSpinner size={7} color="#fff" />
                        ) : (
                            <span>Upload</span>
                        )}
                        <input
                            type="file"
                            onChange={handleFileChange}
                            disabled={uploading}
                            hidden
                        />
                    </label>
                </div>

                {formData.docs.length > 0 && (
                    <div className="file-list-container">
                        <ul className="file-list">
                            {formData.docs.map((url, idx) => (
                                <li key={idx}>
                                    <span className="file-index">{idx + 1}.</span>
                                    <a href={url} target="_blank" rel="noreferrer">
                                        {getOriginalFileName(getFileNameFromUrl(url))}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {error && <p className="assignment-error">{error}</p>}

            <div className="assignment-actions">
                <button onClick={handleSubmit} disabled={loading}>Add</button>
                <button onClick={handleCancel} className="cancel-btn" disabled={loading}>Cancel</button>
            </div>
        </div>
    );
};

export default AddAssignment;
