import './Message.css';
import FileLink from "./FileLink.jsx";

const Message = ({text, time, isSender, isFile}) => {
    return (
        <div className={`message-container ${isSender ? 'sender' : 'receiver'}`}>
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
