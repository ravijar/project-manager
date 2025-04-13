import React, {useRef, useState} from "react";
import {uploadFile} from "../../services/fileService.js";
import LoadingSpinner from "../common/LoadingSpinner";
import "./FileUpload.css";

const FileUpload = ({chatId, onFileUploaded}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // "success", "error", or null
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadStatus(null);
    };

    const handleUpload = async () => {
        if (!selectedFile || !chatId) return;

        setUploading(true);
        try {
            const url = await uploadFile(selectedFile, chatId);
            onFileUploaded(url);
            setUploadStatus("success");
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus("error");
        } finally {
            setUploading(false);
            setTimeout(() => {
                setSelectedFile(null);
                setUploadStatus(null);
                fileInputRef.current.value = null;
            }, 5000);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setUploadStatus(null);
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
                    <p className="file-name">{selectedFile.name}</p>

                    {uploading ? (
                        <LoadingSpinner size={24} color="#4285f4"/>
                    ) : (
                        <div className="file-buttons">
                            <button className="upload-btn" onClick={handleUpload}>Upload</button>
                            <button className="remove-btn" onClick={handleRemove}>Remove</button>
                        </div>
                    )}

                    {uploadStatus === "success" && <p className="upload-success">Upload successful!</p>}
                    {uploadStatus === "error" && <p className="upload-error">Upload failed. Try again.</p>}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
