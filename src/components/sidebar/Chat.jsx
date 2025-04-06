import './Chat.css';
import Avatar from '../common/Avatar';

const Chat = ({height, avatarSrc, name, onChatClick, chatId}) => {
    return (
        <div
            className="chat"
            style={{height: height}}
            onClick={() => onChatClick(chatId)}
        >
            <Avatar src={avatarSrc} size={height - 16}/>
            <span className="chat-name">{name}</span>
        </div>
    );
};

export default Chat;
