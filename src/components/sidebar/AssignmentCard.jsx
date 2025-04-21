import './AssignmentCard.css';

const AssignmentCard = ({name, field, dueBy, onClick, selected}) => {
    return (
        <div
            className={`assignment-card ${selected ? 'assignment-active' : ''}`}
            onClick={onClick}
        >
            <div className="assignment-name">{name}</div>
            <div className="assignment-details">
                <span className="assignment-field">{field}</span>
                <span className="assignment-due">{dueBy}</span>
            </div>
        </div>
    );
};

export default AssignmentCard;
