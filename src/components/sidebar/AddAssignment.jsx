import React, { useState } from "react";
import "./AddAssignment.css";
import { uploadChatFile } from "../../services/fileService";
import LoadingSpinner from "../common/LoadingSpinner";

const FIELDS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "History", "Geography"];

const AddAssignment = ({ userId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        field: "",
        description: "",
        dueBy: "",
        docs: [],
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

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
            const url = await uploadChatFile(file, userId);
            setFormData((prev) => ({ ...prev, docs: [...prev.docs, url] }));
        } catch (err) {
            console.error("File upload failed:", err);
            setError("File upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = null; // Reset file input
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.field || !formData.description || !formData.dueBy) {
            setError("Please fill in all required fields.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="add-assignment-container">
            <h3>Add New Assignment</h3>

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

            <input
                type="date"
                name="dueBy"
                value={formData.dueBy}
                onChange={handleInputChange}
            />

            <input type="file" onChange={handleFileChange} disabled={uploading} />

            {uploading && <LoadingSpinner size={18} color="#3498db" />}
            {error && <p className="assignment-error">{error}</p>}

            <ul className="file-list">
                {formData.docs.map((url, idx) => (
                    <li key={idx}><a href={url} target="_blank" rel="noreferrer">File {idx + 1}</a></li>
                ))}
            </ul>

            <div className="assignment-actions">
                <button onClick={handleSubmit}>Add</button>
                <button onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

export default AddAssignment;
