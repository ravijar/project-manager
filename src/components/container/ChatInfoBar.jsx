import Avatar from '../common/Avatar';
import './ChatInfoBar.css';

const ChatInfoBar = ({ avatarSrc, name }) => {
  return (
    <div className="chat-info-bar">
      <Avatar src={avatarSrc} size={40} />
      <span className="chat-info-name">{name}</span>
    </div>
  );
};

export default ChatInfoBar;
