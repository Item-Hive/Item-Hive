import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { useNavigate, Link } from "react-router-dom";
const USER_KEY = "ict_branded_user";
const API_URL = import.meta.env.VITE_API_URL;

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

export default function Profile() {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
        <div className="profile-section-card">
          <div className="card-header-bar">My Recent Orders</div>
          <div className="card-body">
            {loadingOrders && <p style={{ color: "#64748B" }}>Loading orders...</p>}
            {!loadingOrders && orders.length === 0 && (
              <p style={{ color: "#64748B" }}>No orders yet.</p>
            )}
            {!loadingOrders &&
              orders.map((order) => (
                <div className="order-row" key={order.id}>
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
                  <span className="order-price">{money(order.receipt?.total || 0)}</span>
                </div>
              ))}
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
              <button className="settings-action-btn">Edit</button>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Size Preference</span>
                <span className="settings-val">{user?.sizePreference || "Not set"}</span>
              </div>
              <button className="settings-action-btn">Edit</button>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <span className="settings-label">Notifications</span>
                <span className="settings-val">Order updates & promotions</span>
              </div>
              <button className="settings-action-btn">Manage</button>
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
    </div>
  );
}
