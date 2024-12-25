import './Message.css';

const Message = ({ text, time, isSender }) => {
  return (
    <div className={`message-container ${isSender ? 'sender' : 'receiver'}`}>
      <div className="message-body">
        <p className="message-text">{text}</p>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export default Message;
