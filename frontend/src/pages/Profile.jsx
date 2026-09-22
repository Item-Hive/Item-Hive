import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const USER_KEY = "ict_branded_user";

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

// Admin if the ID starts with ADM, otherwise treated as a student
const isAdminUser = (user) => {
  const id = String(user?.idNumber || "").toUpperCase();
  return id.startsWith("ADM");
};

export default function Profile() {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const admin = isAdminUser(user);
  const idValue = user?.idNumber || "—";
  const idLabel = admin ? "Admin" : "Student";
  const displayName = admin ? "Admin Account" : "Student Account";
  const email = user?.email && user.email.trim() !== "" ? user.email : "Not set";

  const handleSignOut = () => {
    localStorage.removeItem(USER_KEY);
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-top-label">Account Dashboard</div>

      {/* Hero Banner Header */}
      <div className="profile-hero-banner">
        <div className="hero-top-bar">
          <span className="hero-brand">
            Item <span className="brand-orange">Hive</span>
          </span>
          <span className="hero-right-label">My Profile</span>
        </div>

        <div className="hero-user-info">
          <div className="avatar-badge">{idLabel[0]}</div>
          <h2 className="user-name">{displayName}</h2>
          <p className="user-subtext">
            {idLabel} #{idValue}
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="profile-content-container">
        {/* My Orders Section */}
        <div className="profile-section-card">
          <div className="card-header-bar">My Recent Orders</div>
          <div className="card-body">
            <div className="order-row">
              <div className="order-details">
                <span className="order-id">Order #0001</span>
                <span className="order-item-desc">ICT Classic - Custom Print</span>
              </div>
              <span className="order-price">R200</span>
            </div>

            <div className="order-row">
              <div className="order-details">
                <span className="order-id">Order #0002</span>
                <span className="order-item-desc">ICT Crop Top</span>
              </div>
              <span className="order-price">R130</span>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
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
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="signout-wrapper">
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}