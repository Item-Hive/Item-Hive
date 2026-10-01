
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginPhoto from "../assets/students-typing.jpg";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  const navigate = useNavigate();

  // Start waking the Render server as soon as the login page opens
  useEffect(() => {
    fetch(`${API_URL}/api/item`).catch(() => {});
  }, []);

  // Show a "waking up the server" hint if a request takes more than 5 seconds
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  const resetSignUpOnlyFields = () => {
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setEmail("");
  };

  const clearMessages = () => {
    setError(null);
    setNotice(null);
    setDuplicate(false);
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    clearMessages();
    resetSignUpOnlyFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (isSignUp) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const body = {
          role,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          ...(role === "student" ? { studentNumber: identifier } : { idNumber: identifier }),
        };
        const res = await fetch(`${API_URL}/api/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          if (res.status === 409 || /already|exist|duplicate|in use/i.test(text)) {
            setDuplicate(true);
            setError("This user is already on the system.");
            return;
          }
          throw new Error("Registration failed. That number may already be in use.");
        }

        setIsSignUp(false);
        resetSignUpOnlyFields();
        setNotice("Account created! Check your email for a verification link, then sign in.");
      } else {
        const endpoint = role === "student" ? "login/student" : "login/admin";
        const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: identifier, password }),
        });
        if (!res.ok) throw new Error("Invalid student number/ID or password.");
        const user = await res.json();
        localStorage.setItem("ict_branded_user", JSON.stringify(user));
        navigate("/products");
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Can't reach the server. Please try again in a moment."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {loading && (
        <div style={loadingOverlayStyle} role="status" aria-live="polite">
          <style>{`@keyframes ih-spin{to{transform:rotate(360deg)}}`}</style>
          <div style={spinnerStyle} />
          <p style={loadingTextStyle}>{isSignUp ? "Creating your account…" : "Signing you in…"}</p>
          {slow && (
            <p style={loadingSubStyle}>
              Waking up the server. This can take up to a minute the first time.
            </p>
          )}
        </div>
      )}

      <div style={formPanelStyle}>
        <div style={cardStyle}>
          <div style={logoWrapperStyle}>
            <img
              src="https://item-hive.github.io/src/Blue%20Playful%20Handwriting%20Creative%20Studio%20Logo%20(1).png"
              alt="ItemHive Logo"
              style={logoStyle}
            />
          </div>

          <h2 style={titleStyle}>
            Welcome to <span style={{ color: "#F97316" }}>ItemHive</span>
          </h2>
          <p style={subtitleStyle}>Sign in to access your store dashboard</p>

          <div style={toggleContainerStyle}>
            <button type="button" style={getToggleStyle(!isSignUp)} onClick={switchToSignIn}>
              Sign In
            </button>
            <button
              type="button"
              style={getToggleStyle(isSignUp)}
              onClick={() => {
                setIsSignUp(true);
                clearMessages();
              }}
            >
              Sign Up
            </button>
          </div>

          <div style={toggleContainerStyle}>
            <button type="button" style={getToggleStyle(role === "student")} onClick={() => setRole("student")}>
              Student
            </button>
            <button type="button" style={getToggleStyle(role === "admin")} onClick={() => setRole("admin")}>
              Admin
            </button>
          </div>

          <form style={formStyle} onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John"
                    style={inputStyle}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Doe"
                    style={inputStyle}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    style={inputStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div style={inputGroupStyle}>
              <label style={labelStyle}>{role === "student" ? "Student Number" : "Staff ID Number"}</label>
              <input
                type="text"
                placeholder={role === "student" ? "e.g. 219012345" : "e.g. ADM001"}
                style={inputStyle}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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

            {isSignUp && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  style={inputStyle}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ accentColor: "#F97316", cursor: "pointer", width: "16px", height: "16px" }}
              />
              Show Password
            </label>

            {notice && <p style={noticeStyle}>{notice}</p>}

            {error && (
              <div style={errorBoxStyle} role="alert">
                <p style={{ margin: 0 }}>{error}</p>
                {duplicate && (
                  <button type="button" style={linkBtnStyle} onClick={switchToSignIn}>
                    Already registered? Sign in instead
                  </button>
                )}
              </div>
            )}

            <button type="submit" style={{ ...submitBtnStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <div style={imagePanelStyle}>
        <div style={imagePhotoStyle} />
        <div style={imageOverlayStyle} />
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const imagePanelStyle = {
  flex: 1,
  position: "relative",
  overflow: "hidden",
};

const imagePhotoStyle = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${loginPhoto})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const imageOverlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(15,23,42,0) 55%, rgba(15,23,42,0.25) 100%)",
};

const formPanelStyle = {
  flex: 1,
  minWidth: "380px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F8FAFC",
  padding: "20px",
  boxSizing: "border-box",
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

const noticeStyle = {
  margin: 0,
  padding: "10px 12px",
  borderRadius: "8px",
  background: "#F0FDF4",
  border: "1px solid #BBF7D0",
  color: "#166534",
  fontSize: "0.85rem",
};

const errorBoxStyle = {
  color: "#DC2626",
  fontSize: "0.85rem",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const linkBtnStyle = {
  alignSelf: "flex-start",
  background: "none",
  border: "none",
  padding: 0,
  color: "#F97316",
  fontWeight: 600,
  fontSize: "0.85rem",
  cursor: "pointer",
  textDecoration: "underline",
};

const loadingOverlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  background: "rgba(248, 250, 252, 0.85)",
  backdropFilter: "blur(3px)",
};

const spinnerStyle = {
  width: "48px",
  height: "48px",
  border: "4px solid #FED7AA",
  borderTopColor: "#F97316",
  borderRadius: "50%",
  animation: "ih-spin 0.8s linear infinite",
};

const loadingTextStyle = {
  margin: 0,
  color: "#0F172A",
  fontWeight: 600,
  fontSize: "1rem",
};

const loadingSubStyle = {
  margin: 0,
  color: "#64748B",
  fontSize: "0.85rem",
  maxWidth: "280px",
  textAlign: "center",
};

export default Login;