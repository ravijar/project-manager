import Avatar from '../../../common/avatar/Avatar.jsx';
import './ChatInfoBar.css';
import LoadingSpinner from '../../../common/loading-spinner/LoadingSpinner.jsx';

const ChatInfoBar = ({avatarSrc, name, loadingMessages}) => {
    return (
        <div className="chat-info-bar">
            <Avatar src={avatarSrc} size={30}/>
            <span className="chat-info-name">{name}</span>
            {loadingMessages && (
                <div className="chat-info-spinner">
                    <LoadingSpinner size={15} color="#3498db"/>
                </div>
            )}
        </div>
    );
};

export default ChatInfoBar;
