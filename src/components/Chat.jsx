import './Chat.css';
import Avatar from './Avatar';

const Chat = ({ height, avatarSrc, avatarSize, name }) => {
  return (
    <div className="chat" style={{ height: height }}>
      <Avatar src={avatarSrc} size={height - 16} />
      <span className="chat-name">{name}</span>
    </div>
  );
};

export default Chat;
