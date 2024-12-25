import React, { useState } from "react";
import "./FooterBar.css";

const FooterBar = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="footer-bar">
      <input
        type="text"
        className="message-input"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default FooterBar;
