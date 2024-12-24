import './ChatInfoBar.css';

const ChatInfoBar = ({ avatarSrc, name }) => {
  return (
    <div className="chat-info-bar">
      <img src={avatarSrc} alt="Avatar" className="chat-info-avatar" />
      <span className="chat-info-name">{name}</span>
    </div>
  );
};

export default ChatInfoBar;
