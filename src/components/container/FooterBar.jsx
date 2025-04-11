import React, {useState} from "react";
import "./FooterBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Popup from "../common/Popup";
import {uploadFile} from "../../supabase/storage/media.js";

const FooterBar = ({onSendMessage, chatId}) => {
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        console.log(chatId);

        if (!selectedFile || !chatId) return;
        const url = await uploadFile(selectedFile, selectedFile.name, chatId);
        onSendMessage(url);
        setShowPopup(false);
        setSelectedFile(null);
    };

    return (
        <div className="footer-bar">
            <button className="upload-btn" onClick={() => setShowPopup(true)}>
                <FontAwesomeIcon icon={faPaperclip} />
            </button>

            <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />

            {showPopup && (
                <Popup onClose={() => setShowPopup(false)} width="300px">
                    <input type="file" onChange={handleFileChange} />
                    {selectedFile && (
                        <div style={{ marginTop: "10px" }}>
                            <p>{selectedFile.name}</p>
                            <button onClick={handleFileUpload}>Upload</button>
                        </div>
                    )}
                </Popup>
            )}
        </div>
    );
};

export default FooterBar;
