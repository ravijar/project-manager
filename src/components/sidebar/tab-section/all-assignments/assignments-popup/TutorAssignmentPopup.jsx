import React, { useState } from "react";
import Popup from "../../../../common/popup/Popup.jsx";
import "../AllAssignments.css";

const TutorAssignmentPopup = ({
  assignment,
  onClose,
  onBid,
  isBidding = false,
}) => {
  const [bidAmount, setBidAmount] = useState("");

  const formatDate = (d) =>
    d?.toDate?.() ? d.toDate().toLocaleDateString() : d;

  const handleBidClick = () => {
    const value = Number(bidAmount);
    if (!Number.isFinite(value) || value <= 0) return; // basic guard
    onBid?.(assignment, value);
  };

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

          {/* Bid input */}
          <div className="detail-row">
            <span className="detail-label">Your Bid:</span>
            <div className="detail-value">
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <button
            className="btn primary"
            onClick={handleBidClick}
            disabled={isBidding || !bidAmount || Number(bidAmount) <= 0}
            title="Place a bid for this assignment"
          >
            {isBidding ? "Submitting..." : "Bid"}
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default TutorAssignmentPopup;
