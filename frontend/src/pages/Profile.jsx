import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import { useNavigate, Link } from "react-router-dom";

const USER_KEY = "ict_branded_user";
const API_URL = import.meta.env.VITE_API_URL;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_NOTIF = { orderUpdates: true, promotions: true };

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const isAdminUser = (user) => {
  const id = String(user?.idNumber || "").toUpperCase();
  return id.startsWith("ADM");
};

const money = (n) => "R" + (n % 1 === 0 ? n : n.toFixed(2));

const notifSummary = (p) => {
  if (p.orderUpdates && p.promotions) return "Order updates & promotions";
  if (p.orderUpdates) return "Order updates only";
  if (p.promotions) return "Promotions only";
  return "All notifications off";
};

/* ---------- small building blocks ---------- */

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={overlayStyle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={title} style={modalStyle}>
        <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>{title}</h3>
        {subtitle && <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "#64748B" }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        border: "none",
        padding: 3,
        cursor: "pointer",
        background: checked ? "#FF6B00" : "#CBD5E1",
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        }}
      />
    </button>
  );
}

function EmailForm({ user, onSaved, onClose }) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user?.id) return setError("You need to be signed in to change your email.");
    if (!/\S+@\S+\.\S+/.test(newEmail)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password to confirm.");

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, password, newEmail: newEmail.trim() }),
      });

      if (res.status === 401) throw new Error("Incorrect password.");
      if (res.status === 400 || res.status === 409) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Couldn't update your email.");
      }
      if (!res.ok) throw new Error("Couldn't update your email. Please try again.");

      onSaved(newEmail.trim());
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Can't reach the server. Please try again in a moment."
          : err.message
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <label style={fieldLabelStyle} htmlFor="pf-new-email">New email address</label>
      <input
        id="pf-new-email"
        type="email"
        autoFocus
        placeholder="you@example.com"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        style={inputStyle}
      />

      <label style={{ ...fieldLabelStyle, marginTop: 12 }} htmlFor="pf-password">Current password</label>
      <input
        id="pf-password"
        type="password"
        placeholder="Confirm it's you"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <p style={{ margin: "10px 0 0", fontSize: "0.78rem", color: "#64748B" }}>
        We'll send a verification link to the new address.
      </p>

      {error && (
        <p role="alert" style={{ margin: "10px 0 0", color: "#DC2626", fontSize: "0.85rem" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button type="button" style={secondaryBtnStyle} onClick={onClose}>Cancel</button>
        <button type="submit" style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }} disabled={saving}>
          {saving ? "Saving…" : "Save email"}
        </button>
      </div>
    </form>
  );
}

function SizeForm({ current, onSave }) {
  const [selected, setSelected] = useState(current || "");
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSelected(s)}
            aria-pressed={selected === s}
            style={{
              ...chipStyle,
              ...(selected === s ? { background: "#FF6B00", borderColor: "#FF6B00", color: "#fff" } : {}),
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button type="button" style={secondaryBtnStyle} onClick={() => onSave("")}>Clear</button>
        <button type="button" style={primaryBtnStyle} onClick={() => onSave(selected)}>Save</button>
      </div>
    </>
  );
}

/* ---------- page ---------- */

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getLoggedInUser);
  const notifKey = `ict_branded_notif_${user?.id || "guest"}`;
  const sizeKey = `ict_branded_size_${user?.id || "guest"}`;

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [modal, setModal] = useState(null); // "email" | "size" | "notif" | null
  const [notice, setNotice] = useState(null);
  const [notif, setNotif] = useState(() => {
    try {
      return { ...DEFAULT_NOTIF, ...(JSON.parse(localStorage.getItem(notifKey) || "null") || {}) };
    } catch {
      return DEFAULT_NOTIF;
    }
  });
  const [sizePref, setSizePref] = useState(
    () => localStorage.getItem(sizeKey) || user?.sizePreference || ""
  );

  const admin = isAdminUser(user);
  const idValue = user?.idNumber || "—";
  const idLabel = admin ? "Admin" : "Student";
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : admin ? "Admin Account" : "Student Account";
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : idLabel[0];
  const email = user?.email && user.email.trim() !== "" ? user.email : "Not set";

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

  // Hide the success message after a few seconds
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const closeModal = () => setModal(null);

  const updateNotif = (key, value) => {
    const next = { ...notif, [key]: value };
    setNotif(next);
    try {
      localStorage.setItem(notifKey, JSON.stringify(next));
    } catch {
      /* storage unavailable, ignore */
    }
  };

  const handleSizeSave = (size) => {
    try {
      if (size) localStorage.setItem(sizeKey, size);
      else localStorage.removeItem(sizeKey);
    } catch {
      /* storage unavailable, ignore */
    }
    setSizePref(size);
    setModal(null);
    setNotice(size ? `Size preference saved: ${size}` : "Size preference cleared.");
  };

  const handleEmailSaved = (newEmail) => {
    const updated = { ...user, email: newEmail };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
    setModal(null);
    setNotice("Email updated. We've sent a verification link to your new address.");
  };

  const handleSignOut = () => {
    localStorage.removeItem(USER_KEY);
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-top-label">Account Dashboard</div>

      <div className="profile-hero-banner">
        <div className="hero-top-bar">
          <span className="hero-brand">
            Item <span className="brand-orange">Hive</span>
          </span>
          <span className="hero-right-label">My Profile</span>
        </div>

        <div className="hero-user-info">
          <div className="avatar-badge">{initials}</div>
          <h2 className="user-name">{displayName}</h2>
          <p className="user-subtext">
            {idLabel} #{idValue}
          </p>
        </div>
      </div>

      <div className="profile-content-container">
        {notice && (
          <div role="status" style={noticeStyle}>
            {notice}
          </div>
        )}

        <div className="profile-section-card">
          <div className="card-header-bar">My Recent Orders</div>
          <div className="card-body">
            {loadingOrders && <p style={{ color: "#64748B" }}>Loading orders...</p>}
            {!loadingOrders && orders.length === 0 && (
              <p style={{ color: "#64748B" }}>No orders placed yet.</p>
            )}
            {!loadingOrders &&
              orders.map((order) => {
                const orderRef = order.orderNumber || (order.id ? `IH-${order.id.slice(0, 6)}` : "IH-ORDER");
                return (
                  <div className="order-row" key={order.id} style={{ padding: "12px 0", borderBottom: "1px solid #E2E8F0" }}>
                    <div className="order-details">
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FF6B00" }}>
                        #{orderRef}
                      </div>
                      <span className="order-id" style={{ fontWeight: 600 }}>{order.receipt?.itemName}</span>
                      <span className="order-item-desc" style={{ display: "block", fontSize: "0.85rem", color: "#64748B" }}>
                        {order.receipt?.deliveryType === "paxi" ? "PAXI" : "Standard Delivery"}
                        {order.receipt?.deliverySummary ? ` – ${order.receipt.deliverySummary}` : ""}
                      </span>
                    </div>
                    <span className="order-price" style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {money(order.receipt?.total || 0)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="profile-section-card">
          <div className="card-header-bar">Account Settings</div>
          <div className="card-body settings-list">
            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Email Address</span>
                <span className="settings-val">{email}</span>
              </div>
              <button className="settings-action-btn" onClick={() => setModal("email")}>Edit</button>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Size Preference</span>
                <span className="settings-val">{sizePref || "Not set"}</span>
              </div>
              <button className="settings-action-btn" onClick={() => setModal("size")}>Edit</button>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Notifications</span>
                <span className="settings-val">{notifSummary(notif)}</span>
              </div>
              <button className="settings-action-btn" onClick={() => setModal("notif")}>Manage</button>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Report a Product / Refund</span>
                <span className="settings-val">Had an issue with an order?</span>
              </div>
              <Link to="/report-refund" className="settings-action-btn">
                Report / Refund
              </Link>
            </div>
          </div>
        </div>

        <div className="signout-wrapper">
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      {modal === "email" && (
        <Modal title="Change email" subtitle="Confirm with your password to update your address." onClose={closeModal}>
          <EmailForm user={user} onSaved={handleEmailSaved} onClose={closeModal} />
        </Modal>
      )}

      {modal === "size" && (
        <Modal title="Size preference" subtitle="Pick the size you usually wear." onClose={closeModal}>
          <SizeForm current={sizePref} onSave={handleSizeSave} />
        </Modal>
      )}

      {modal === "notif" && (
        <Modal title="Notifications" subtitle="Choose which emails you'd like to receive." onClose={closeModal}>
          <div style={{ ...rowStyle, borderTop: "1px solid #E2E8F0" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#0F172A" }}>Order updates</div>
              <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Includes your order confirmation email.</div>
            </div>
            <Toggle checked={notif.orderUpdates} onChange={(v) => updateNotif("orderUpdates", v)} label="Order updates" />
          </div>
          <div style={{ ...rowStyle, borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#0F172A" }}>Promotions</div>
              <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Student deals and new product drops.</div>
            </div>
            <Toggle checked={notif.promotions} onChange={(v) => updateNotif("promotions", v)} label="Promotions" />
          </div>
          <button type="button" style={{ ...primaryBtnStyle, width: "100%", marginTop: 18 }} onClick={closeModal}>
            Done
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ---------- styles ---------- */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  background: "rgba(15, 23, 42, 0.5)",
};

const modalStyle = {
  width: "100%",
  maxWidth: 400,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.35)",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 0",
};

const fieldLabelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#334155",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: 44,
  padding: "0 14px",
  border: "1px solid #CBD5E1",
  borderRadius: 12,
  fontSize: "0.95rem",
  color: "#0F172A",
  background: "#fff",
};

const primaryBtnStyle = {
  flex: 1,
  height: 46,
  border: "none",
  borderRadius: 12,
  background: "#FF6B00",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
};

const secondaryBtnStyle = {
  flex: 1,
  height: 46,
  border: "1px solid #CBD5E1",
  borderRadius: 12,
  background: "#fff",
  color: "#334155",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
};

const chipStyle = {
  minWidth: 56,
  height: 40,
  padding: "0 14px",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  background: "#fff",
  color: "#334155",
  fontWeight: 600,
  cursor: "pointer",
};

const noticeStyle = {
  marginBottom: 16,
  padding: "12px 14px",
  borderRadius: 12,
  background: "#F0FDF4",
  border: "1px solid #BBF7D0",
  color: "#166534",
  fontSize: "0.9rem",
};