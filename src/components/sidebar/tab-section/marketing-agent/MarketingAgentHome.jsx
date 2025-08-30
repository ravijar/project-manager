import React, { useEffect, useMemo, useState } from "react";
import "./MarketingAgentHome.css";

const currencyLK = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0
});

export default function MarketingAgentHome({ user }) {
  const [referralCode, setReferralCode] = useState("AGT-9X2F4");
  const [earnings, setEarnings] = useState(40250);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // mock assignments per user (replace with Firestore later)
  const assignmentsByUser = {
    "1": [{ id: "A-101", title: "Physics Grade 10", status: "Ongoing" }],
    "2": [{ id: "A-102", title: "IELTS General", status: "Pending" }],
    "3": [
      { id: "A-103", title: "Maths Revision", status: "Completed" },
      { id: "A-104", title: "Chemistry Pack", status: "Ongoing" }
    ]
  };

  useEffect(() => {
    setLoading(true);

    // -------- Mock data fallback --------
    const timer = setTimeout(() => {
      setReferralCode("AGT-7M2QX");
      setEarnings(40250);
      setRows([
        {
          id: "1",
          name: "Naveen Perera",
          email: "naveen@example.com",
          joinedAt: new Date("2025-08-11"),
          status: "active",
          commission: 2500
        },
        {
          id: "2",
          name: "Ishara Silva",
          email: "ishara@example.com",
          joinedAt: new Date("2025-08-05"),
          status: "pending",
          commission: 0
        },
        {
          id: "3",
          name: "Rashmi Fernando",
          email: "rashmi@example.com",
          joinedAt: new Date("2025-07-30"),
          status: "active",
          commission: 4800
        }
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      const area = document.createElement("textarea");
      area.value = referralCode;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const openPanel = (row) => {
    setSelectedUser(row);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
  };

  return (
    <div className="split-wrap">
      {/* LEFT: main agent view */}
      <div className="agent-home">
        <div className="agent-header">
          <div className="referral-block">
            <label className="label">Referral Code</label>
            <div className="referral-input">
              <input value={referralCode} readOnly />
              <button
                className="copy-btn"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              </button>
              {copied && <span className="copied">Copied!</span>}
            </div>
          </div>

          <div className="earnings-block">
            <label className="label">Total Earnings</label>
            <div className="amount">{currencyLK.format(earnings)}</div>
          </div>
        </div>

        <div className="manage-title">Manage Referred Users</div>

        <div className="table-card">
          <div className="table-toolbar">
            <input
              className="search"
              placeholder="Search name, email or status…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="skeleton">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="empty">No referred users yet.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="right">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => openPanel(r)}
                      className="row-click"
                    >
                      <td>{r.name}</td>
                      <td className="muted">{r.email}</td>
                      <td>{r.joinedAt ? r.joinedAt.toLocaleDateString() : "—"}</td>
                      <td>
                        <span className={`badge ${r.status}`}>
                          {capitalize(r.status)}
                        </span>
                      </td>
                      <td className="right">
                        {currencyLK.format(r.commission || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: side panel */}
      <aside
        className={`side-panel ${panelOpen ? "open" : ""}`}
        aria-hidden={!panelOpen}
      >
        <div className="side-header">
          <strong>{selectedUser ? selectedUser.name : "Assignments"}</strong>
          <button className="close-btn" onClick={closePanel} aria-label="Close">
            ×
          </button>
        </div>

        {!selectedUser ? (
          <div className="side-empty">Select a user to view assignments</div>
        ) : (
          <div className="side-body">
            <div className="side-meta">
              <div>
                <span>Email:</span> {selectedUser.email}
              </div>
              <div>
                <span>Status:</span> {capitalize(selectedUser.status)}
              </div>
            </div>

            <div className="side-list">
              {(assignmentsByUser[selectedUser.id] || []).map((a) => (
                <div key={a.id} className="assignment-card">
                  <div className="a-title">{a.title}</div>
                  <div className="a-sub">
                    <span className={`badge ${a.status.toLowerCase()}`}>
                      {a.status}
                    </span>
                    <span className="a-id">#{a.id}</span>
                  </div>
                </div>
              ))}
              {(assignmentsByUser[selectedUser.id] || []).length === 0 && (
                <div className="side-empty">No assignments for this user.</div>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
