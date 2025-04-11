import React, {useState} from "react";
import "./FooterBar.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperclip} from "@fortawesome/free-solid-svg-icons";
import Popup from "../common/Popup";
import FileUpload from "./FileUpload.jsx";

const FooterBar = ({onSendMessage, chatId}) => {
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="footer-bar">
            <button className="attach-btn" onClick={() => setShowPopup(true)}>
                <FontAwesomeIcon icon={faPaperclip}/>
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
                <Popup onClose={closePopup} width="400px">
                    <FileUpload
                        chatId={chatId}
                        onFileUploaded={(url) => onSendMessage(url, true)}
                        onClose={closePopup}
                    />
                </Popup>
            )}
        </div>
    );
};

export default FooterBar;
