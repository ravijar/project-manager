import Avatar from '../../../common/avatar/Avatar.jsx';
import './ChatInfoBar.css';
import LoadingSpinner from '../../../common/loading-spinner/LoadingSpinner.jsx';
import { useAuth } from '../../../../context/AuthContext';

const ChatInfoBar = ({ avatarSrc, name, role, loadingMessages }) => {
    const { user: currentUser } = useAuth();
    const currentRole = currentUser?.role?.toLowerCase();
    const otherRole = role?.toLowerCase();
    const roleLabel = otherRole ? otherRole.charAt(0).toUpperCase() + otherRole.slice(1) : '';

    const isAdmin = currentRole === 'admin';
    const isStudentOrTutor = currentRole === 'student' || currentRole === 'tutor';

    return (
        <div className="chat-info-bar">
            {isAdmin ? (
                <>
                    <Avatar src={avatarSrc} size={30}/>
                    <span className="chat-info-name">{name}</span>
                    {roleLabel && <span className="chat-info-role">{roleLabel}</span>}
                </>
            ) : isStudentOrTutor ? (
                <span className="chat-info-role">{roleLabel}</span>
            ) : (
                <>
                    <Avatar src={avatarSrc} size={30}/>
                    <span className="chat-info-name">{name}</span>
                </>
            )}

            {loadingMessages && (
                <div className="chat-info-spinner">
                    <LoadingSpinner size={10} color="#3498db"/>
                </div>
            )}
        </div>
    );
};

export default ChatInfoBar;
