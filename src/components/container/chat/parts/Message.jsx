import './Message.css';
import FileLink from "./FileLink.jsx";

const Message = ({id, text, time, isSender, isFile, author, isForwarded=false, selectable=false, selected=false, onToggleSelect}) => {
    const handleToggle = () => {
        if (onToggleSelect && id) onToggleSelect(id);
    };

    return (
        <div
            className={`message-container ${isSender ? 'sender' : 'receiver'}`}
            onDoubleClick={handleToggle}
        >
            {author && !isSender && (
                <div className="message-author">{author}</div>
            )}
            {isForwarded && (
                <div className="forwarded-badge">Forwarded</div>
            )}
            {selectable && (
                <div
                    className={`message-select ${selected ? 'selected' : ''}`}
                    onClick={handleToggle}
                    title="Select to forward"
                />
            )}
            <div className="message-body">
                <p className="message-text">
                    {isFile ? <FileLink url={text}/> : text}
                </p>
                <span className="message-time">{time}</span>
            </div>
        </div>
    );
};

export default Message;
