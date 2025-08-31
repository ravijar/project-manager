import './ChatCard.css';
import Avatar from '../../../../common/avatar/Avatar.jsx';

const ChatCard = ({height, avatarSrc, name, onChatClick, chatId, selected, hasUnread}) => {
    return (
        <div
            className={`chat ${selected ? 'chat-active' : ''}`}
            style={{height}}
            onClick={() => onChatClick(chatId)}
        >
            <Avatar src={avatarSrc} size={height - 24}/>
            <span className="chat-name">{name}</span>

            {hasUnread && <div className="unread-indicator"/>}
        </div>
    );
};

export default ChatCard;
