import './AssignmentCard.css';

const AssignmentCard = ({name, field, dueBy, assignmentChatId, onClick, selected, hasUnread}) => {
    return (
        <div
            className={`assignment-card ${selected ? 'assignment-active' : ''}`}
            onClick={() => onClick(assignmentChatId)}
        >
            <div className="assignment-name">{name}</div>
            <div className="assignment-details">
                <span className="assignment-field">{field}</span>
                <span className="assignment-due">{dueBy}</span>
            </div>

            {hasUnread && <div className="unread-indicator"/>}
        </div>
    );
};

export default AssignmentCard;
