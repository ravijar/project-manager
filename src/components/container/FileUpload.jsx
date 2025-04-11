import React, { useState } from "react";
import { uploadFile } from "../../supabase/storage/media";

const FileUpload = ({chatId, onFileUploaded, onClose}) => {
    const [selectedFile, setSelectedFile] = useState(null);

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

    return (
        <div className="file-upload-container">
            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
                <div style={{ marginTop: "10px" }}>
                    <p>{selectedFile.name}</p>
                    <button onClick={handleUpload}>Upload</button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
