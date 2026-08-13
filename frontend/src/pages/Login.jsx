import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Brand Logo */}
        <div style={logoWrapperStyle}>
          <img
            src="https://item-hive.github.io/src/Blue%20Playful%20Handwriting%20Creative%20Studio%20Logo%20(1).png"
            alt="ItemHive Logo"
            style={logoStyle}
          />
        </div>

        {/* Header */}
        <h2 style={titleStyle}>
          Welcome to <span style={{ color: "#F97316" }}>ItemHive</span>
        </h2>
        <p style={subtitleStyle}>Sign in to access your store dashboard</p>

        {/* Tab Toggle */}
        <div style={toggleContainerStyle}>
          <button
            type="button"
            style={getToggleStyle(!isSignUp)}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            style={getToggleStyle(isSignUp)}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        {/* Form Inputs */}
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Student Number</label>
            <input
              type="text"
              placeholder="e.g. 219012345"
              style={inputStyle}
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ accentColor: "#F97316", cursor: "pointer", width: "16px", height: "16px" }}
            />
            Show Password
          </label>

          <button type="submit" style={submitBtnStyle}>
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// MODERN LIGHT STYLES
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F8FAFC", /* Light gray/slate background */
  padding: "20px",
  boxSizing: "border-box",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "400px",
  padding: "40px 32px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const logoWrapperStyle = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  padding: "4px",
  border: "1px solid #F1F5F9",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
};

const titleStyle = {
  color: "#0F172A",
  fontSize: "1.5rem",
  fontWeight: "700",
  margin: "0 0 4px 0",
  textAlign: "center",
};

const subtitleStyle = {
  color: "#64748B",
  fontSize: "0.875rem",
  margin: "0 0 24px 0",
  textAlign: "center",
};

const toggleContainerStyle = {
  display: "flex",
  backgroundColor: "#F1F5F9",
  borderRadius: "10px",
  padding: "4px",
  width: "100%",
  marginBottom: "24px",
  boxSizing: "border-box",
};

const getToggleStyle = (active) => ({
  flex: 1,
  padding: "9px 0",
  border: "none",
  background: active ? "#FFFFFF" : "transparent",
  color: active ? "#0F172A" : "#64748B",
  fontWeight: active ? "600" : "500",
  fontSize: "0.875rem",
  borderRadius: "7px",
  cursor: "pointer",
  boxShadow: active ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
  transition: "all 0.15s ease",
});

const formStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  textAlign: "left",
};

const labelStyle = {
  fontSize: "0.8125rem",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  backgroundColor: "#FFFFFF",
  color: "#0F172A",
  fontSize: "0.9375rem",
  outline: "none",
  boxSizing: "border-box",
};

const checkboxRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#475569",
  fontSize: "0.85rem",
  fontWeight: "500",
  cursor: "pointer",
  userSelect: "none",
};

const submitBtnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  backgroundColor: "#F97316",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(249, 115, 22, 0.25)",
  transition: "all 0.15s ease",
};

export default Login;