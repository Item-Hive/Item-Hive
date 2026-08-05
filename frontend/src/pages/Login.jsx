import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.jpg";

function Login() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("signin");

  // Sign In
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up
  const [fullName, setFullName] = useState("");
  const [signupStudentNumber, setSignupStudentNumber] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Error Messages
  const [error, setError] = useState("");
  const [signupError, setSignupError] = useState("");

  // Show Password
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    if (!studentNumber.trim() || !password.trim()) {
      setError("Please enter your student number and password.");
      return;
    }

    setError("");

    navigate("/products", {
      state: {
        studentNumber,
      },
    });
  };

  // SIGN UP
  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !signupStudentNumber.trim() ||
      !signupPassword.trim()
    ) {
      setSignupError("Please fill in all fields.");
      return;
    }

    setSignupError("");

    alert("Account created successfully!");

    setFullName("");
    setSignupStudentNumber("");
    setSignupPassword("");

    setActiveTab("signin");
  };

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-accent"></div>

        <div className="card-inner">
          {/* Logo */}
          <div className="logo-row">
            <div className="logo-placeholder">
              <img src={logo} alt="ItemHive Logo" className="logo-image" />
            </div>

            <div className="logo-text">
              Welcome to <span>ItemHive</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === "signin" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("signin");
                setError("");
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              className={`tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("signup");
                setSignupError("");
              }}
            >
              Sign Up
            </button>
          </div>

          {/* SIGN IN */}
          {activeTab === "signin" && (
            <form className="form-panel active" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Student Number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="error-message">{error}</p>}

              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              <button type="submit" className="btn-primary">
                Sign In
              </button>
            </form>
          )}

          {/* SIGN UP */}
          {activeTab === "signup" && (
            <form className="form-panel active" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Student Number"
                value={signupStudentNumber}
                onChange={(e) => setSignupStudentNumber(e.target.value)}
              />

              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />

              {signupError && <p className="error-message">{signupError}</p>}

              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? "Hide Password" : "Show Password"}
              </button>

              <button type="submit" className="btn-primary">
                Sign Up
              </button>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text">OR</div>
                <div className="divider-line"></div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setActiveTab("signin");
                  setSignupError("");
                }}
              >
                Already have an account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;