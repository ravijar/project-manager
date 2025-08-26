import React, { useMemo, useEffect, useState } from "react";
import Popup from "../../../../common/popup/Popup.jsx";
import { getUserById } from "../../../../../services/userService.js";
import '../AllAssignments.css';

const AdminAssignmentPopup = ({
  assignment,
  onClose,
  onSelfAssign,
  onMarkBidding,
  onSelectBidder,
  isAssigning = false,
  isMarkingBidding = false,
}) => {
  const [bidderMap, setBidderMap] = useState({}); // { [bidderId]: {name, email, ...} }

  const formatDate = (d) =>
    d?.toDate?.() ? d.toDate().toLocaleDateString() : d;

  const isUploaded = assignment?.subStatus === "uploaded";
  const isAdminAssigned = assignment?.subStatus === "admin_assigned";
  const isBidding = assignment?.subStatus === "bidding";

  // Sort bids from lowest to highest
  const sortedBidders = useMemo(() => {
    const arr = Array.isArray(assignment?.bidders) ? [...assignment.bidders] : [];
    return arr.sort((a, b) => Number(a.bid) - Number(b.bid));
  }, [assignment?.bidders]);

  // Load bidder details (name/email) for the current assignment
  useEffect(() => {
    if (!isBidding) return;
    const ids = Array.from(
      new Set((assignment?.bidders ?? []).map(b => b.bidderId))
    );
    if (ids.length === 0) {
      setBidderMap({});
      return;
    }
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        ids.map(async (id) => [id, await getUserById(id)])
      );
      if (cancelled) return;
      const map = {};
      for (const [id, user] of entries) {
        if (user) map[id] = user;
      }
      setBidderMap(map);
    })();
    return () => { cancelled = true; };
  }, [isBidding, assignment?.id, assignment?.bidders]);

  return (
    <Popup onClose={onClose} width={isBidding ? "900px" : "600px"}>
      <div className="popup-horizontal">
        {/* LEFT: details */}
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

        {/* RIGHT: bidding panel (only when subStatus === 'bidding') */}
        {isBidding && (
          <div className="bidding-panel">
            <h3>Current Bids</h3>

            {sortedBidders.length === 0 ? (
              <div className="no-bids">No bids yet.</div>
            ) : (
              <table className="bids-table">
                <colgroup>
                  <col style={{ width: '40px' }} />     {/* # */}
                  <col />                               {/* Bidder */}
                  <col style={{ width: '80px' }} />     {/* Bid */}
                  <col style={{ width: '140px' }} />    {/* Action */}
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bidder</th>
                    <th>Bid</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBidders.map((b, idx) => (
                    <tr key={`${b.bidderId}-${idx}`}>
                      <td>{idx + 1}</td>
                      <td className="truncate" title={bidderMap[b.bidderId]?.email || b.bidderId}>
                        {bidderMap[b.bidderId]?.name || b.bidderId}
                      </td>
                      <td>{Number(b.bid)}</td>
                      <td>
                        <button
                          className="btn primary"
                          onClick={() => onSelectBidder?.(assignment, b)}
                          title="Select this bidder"
                        >
                          Select bidder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Popup>
  );
};

export default AdminAssignmentPopup;
