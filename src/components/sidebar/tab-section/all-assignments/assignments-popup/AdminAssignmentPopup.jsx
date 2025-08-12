import React from "react";
import Popup from "../../../../common/popup/Popup.jsx";
import '../AllAssignments.css';

const AdminAssignmentPopup = ({
  assignment,
  onClose,
  onSelfAssign,
  onMarkBidding,
  isAssigning = false,
}) => {
  const formatDate = (d) =>
    d?.toDate?.() ? d.toDate().toLocaleDateString() : d;

  return (
    <Popup onClose={onClose} width="600px">
      <div className="assignment-popup">
        <h2>{assignment.name}</h2>

        <div className="popup-assignment-details">
          <div className="detail-row">
            <span className="detail-label">Field:</span>
            <span className="detail-value">{assignment.field}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${assignment.status}`}>
              {assignment.status}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Sub Status:</span>
            <span className="detail-value">{assignment.subStatus}</span>
          </div>

          {assignment.dueBy && (
            <div className="detail-row">
              <span className="detail-label">Due Date:</span>
              <span className="detail-value">{formatDate(assignment.dueBy)}</span>
            </div>
          )}

          {assignment.uploadedOn && (
            <div className="detail-row">
              <span className="detail-label">Uploaded On:</span>
              <span className="detail-value">
                {formatDate(assignment.uploadedOn)}
              </span>
            </div>
          )}

          {assignment.description && (
            <div className="detail-row description-row">
              <span className="detail-label">Description:</span>
              <div className="detail-value description-text">
                {assignment.description}
              </div>
            </div>
          )}

          {assignment.docs?.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Documents:</span>
              <div className="detail-value">
                {assignment.docs.length} file(s) attached
              </div>
            </div>
          )}

          {assignment.bidders?.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Bidders:</span>
              <span className="detail-value">
                {assignment.bidders.length} bid(s)
              </span>
            </div>
          )}
        </div>

        <div className="popup-actions">
          <button
            className="btn primary"
            onClick={() => onSelfAssign?.(assignment)}
            disabled={isAssigning}
            title="Assign this to yourself"
          >
            {isAssigning ? "Assigning..." : "Self Assign"}
          </button>
          <button
            className="btn"
            onClick={() => onMarkBidding?.(assignment)}
            title="Mark this assignment as Bidding"
          >
            Set Sub Status: bidding
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default AdminAssignmentPopup;
