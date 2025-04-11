import React, { useRef, useState } from "react";
import { uploadFile } from "../../supabase/storage/media";
import "./FileUpload.css";

const FileUpload = ({chatId, onFileUploaded, onClose}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !chatId) return;

        try {
            const url = await uploadFile(selectedFile, selectedFile.name, chatId);
            onFileUploaded(url);
            onClose();
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setSelectedFile(null);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        fileInputRef.current.value = null;
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input-hidden"
                id="fileInput"
            />
            <label htmlFor="fileInput" className="choose-btn">
                Choose File
            </label>

            {selectedFile && (
                <div className="file-preview">
                    <p>{selectedFile.name}</p>
                    <div className="file-buttons">
                        <button className="upload-btn" onClick={handleUpload}>Upload</button>
                        <button className="remove-btn" onClick={handleRemove}>Remove</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
