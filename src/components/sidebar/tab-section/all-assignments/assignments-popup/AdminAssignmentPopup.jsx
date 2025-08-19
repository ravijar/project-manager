import React from "react";
import Popup from "../../../../common/popup/Popup.jsx";
import '../AllAssignments.css';

const AdminAssignmentPopup = ({
  assignment,
  onClose,
  onSelfAssign,
  onMarkBidding,
  isAssigning = false,
  isMarkingBidding = false, // NEW: for disabling “Enable Bidding” while processing
}) => {
  const formatDate = (d) =>
    d?.toDate?.() ? d.toDate().toLocaleDateString() : d;

  const isUploaded = assignment?.subStatus === "uploaded";
  const isAdminAssigned = assignment?.subStatus === "admin_assigned";
  // const isBidding = assignment?.subStatus === "bidding"; // (not used, but here if you need)

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
          {/* Only show when subStatus is 'uploaded' */}
          {isUploaded && (
            <button
              className="btn primary"
              onClick={() => onSelfAssign?.(assignment)}
              disabled={isAssigning}
              title="Assign this to yourself"
            >
              {isAssigning ? "Assigning..." : "Self Assign"}
            </button>
          )}

          {/* Only show after self-assign → 'admin_assigned' */}
          {isAdminAssigned && (
            <button
              className="btn"
              onClick={() => onMarkBidding?.(assignment)}
              disabled={isMarkingBidding}
              title="Enable bidding for this assignment"
            >
              {isMarkingBidding ? "Enabling..." : "Enable Bidding"}
            </button>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default AdminAssignmentPopup;
