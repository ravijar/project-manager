import './Chat.css';
import Avatar from '../common/Avatar';

const Chat = ({height, avatarSrc, name, onChatClick, chatId, selected, hasUnread}) => {
    return (
        <div
            className={`chat ${selected ? 'chat-active' : ''}`}
            style={{height}}
            onClick={() => onChatClick(chatId)}
        >
            <Avatar src={avatarSrc} size={height - 16}/>
            <span className="chat-name">{name}</span>

            {hasUnread && <div className="unread-indicator"/>}
        </div>
    );
};

export default Chat;
