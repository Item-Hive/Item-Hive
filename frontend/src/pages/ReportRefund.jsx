import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ReportRefund.css";

const USER_KEY = "ict_branded_user";
const API_URL = import.meta.env.VITE_API_URL;

const REASONS = [
  "Damaged item",
  "Wrong size received",
  "Wrong item delivered",
  "Item not as described",
  "Item never arrived",
  "Changed my mind",
  "Other",
];

const REQUEST_TYPES = [
  { key: "refund", label: "Request Refund" },
  { key: "report", label: "Report a Problem" },
];

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const money = (n) => "R" + (n % 1 === 0 ? n : n.toFixed(2));

export default function ReportRefund() {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [requestType, setRequestType] = useState("refund");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoadingOrders(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/invoice/user/${user.id}`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const formValid = selectedOrderId && reason && description.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    // NOTE: swap this endpoint/body for whatever the backend team ships.
    const payload = {
      id: crypto.randomUUID(),
      userId: user?.id,
      invoiceId: selectedOrderId,
      itemName: selectedOrder?.receipt?.itemName,
      type: requestType, // "refund" | "report"
      reason,
      description: description.trim(),
      hasPhoto: !!photo,
    };

    try {
      const res = await fetch(`${API_URL}/api/refund-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit refund/report request:", err);
      setSubmitError(
        "Something went wrong submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="refund-page">
        <div className="refund-content-container">
          <div className="refund-section-card refund-confirm-card">
            <div className="confirm-emoji">✅</div>
            <h2 className="confirm-title">Request Submitted</h2>
            <p className="confirm-detail">
              We've received your {requestType === "refund" ? "refund request" : "report"} for{" "}
              <strong>{selectedOrder?.receipt?.itemName}</strong>. Our team will
              be in touch via <strong>{user?.email || "your account"}</strong>.
            </p>
            <button className="refund-primary-btn" onClick={() => navigate("/profile")}>
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="refund-page">
      <div className="refund-top-label">Account Dashboard</div>

      <div className="refund-hero-banner">
        <div className="hero-top-bar">
          <span className="hero-brand">
            Item <span className="brand-orange">Hive</span>
          </span>
          <Link className="hero-right-label" to="/profile">
            ← Back to Profile
          </Link>
        </div>

        <div className="hero-user-info">
          <h2 className="user-name">Report a Product / Request a Refund</h2>
          <p className="user-subtext">
            Tell us what went wrong and we'll help sort it out.
          </p>
        </div>
      </div>

      <div className="refund-content-container">
        <div className="refund-section-card">
          <div className="card-header-bar">Request Type</div>
          <div className="card-body">
            <div className="type-toggle-group">
              {REQUEST_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.key}
                  className={`type-toggle-btn ${requestType === t.key ? "active" : ""}`}
                  onClick={() => setRequestType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="refund-section-card">
            <div className="card-header-bar">Select an Order</div>
            <div className="card-body">
              {loadingOrders && <p className="muted-text">Loading orders...</p>}
              {!loadingOrders && orders.length === 0 && (
                <p className="muted-text">
                  No orders found on your account yet.
                </p>
              )}
              {!loadingOrders &&
                orders.map((order) => (
                  <label
                    className={`order-select-row ${
                      selectedOrderId === order.id ? "selected" : ""
                    }`}
                    key={order.id}
                  >
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={() => setSelectedOrderId(order.id)}
                    />
                    <div className="order-details">
                      <span className="order-id">{order.receipt?.itemName}</span>
                      <span className="order-item-desc">
                        {order.receipt?.deliveryType === "paxi"
                          ? "PAXI"
                          : "Standard Delivery"}
                        {order.receipt?.deliverySummary
                          ? ` – ${order.receipt.deliverySummary}`
                          : ""}
                      </span>
                    </div>
                    <span className="order-price">
                      {money(order.receipt?.total || 0)}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          <div className="refund-section-card">
            <div className="card-header-bar">Details</div>
            <div className="card-body settings-list">
              <div className="form-field">
                <label className="settings-label" htmlFor="reason">
                  Reason
                </label>
                <select
                  id="reason"
                  className="refund-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="settings-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="refund-textarea"
                  placeholder="Tell us more (at least 10 characters)..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="settings-label" htmlFor="photo">
                  Photo Evidence (optional)
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="refund-file-input"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
                {photo && <span className="settings-val">{photo.name}</span>}
              </div>
            </div>
          </div>

          {submitError && <p className="error-text">{submitError}</p>}

          <div className="refund-submit-wrapper">
            <button
              type="submit"
              className="refund-primary-btn"
              disabled={!formValid || submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
