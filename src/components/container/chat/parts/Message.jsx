import './Message.css';
import FileLink from "./FileLink.jsx";

const Message = ({text, time, isSender, isFile, author}) => {
    return (
        <div className={`message-container ${isSender ? 'sender' : 'receiver'}`}>
            {author && !isSender && (
                <div className="message-author">{author}</div>
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
