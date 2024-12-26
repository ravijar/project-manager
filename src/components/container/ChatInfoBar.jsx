import Avatar from '../common/Avatar';
import './ChatInfoBar.css';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatInfoBar = ({ avatarSrc, name, loadingMessages }) => {
  return (
    <div className="chat-info-bar">
      <Avatar src={avatarSrc} size={40} />
      <span className="chat-info-name">{name}</span>
      {loadingMessages && (
        <div className="chat-info-spinner">
          <LoadingSpinner size={20} color="#3498db" />
        </div>
      )}
    </div>
  );
};

export default ChatInfoBar;
