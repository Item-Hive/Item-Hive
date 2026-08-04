import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/Login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/products"); 
  };

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-accent"></div>

        <div className="card-inner">
          {/* Logo */}
          <div className="logo-row">
            <div className="logo-placeholder">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0097B2"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
              </svg>
            </div>

            <div className="logo-text">
              Welcome to ICT <span>Branded</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === "signin" ? "active" : ""}`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>

            <button
              type="button"
              className={`tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In */}
          {activeTab === "signin" && (
            <div className="form-panel active">
              <input type="text" placeholder="Student Number" />

              <input type="password" placeholder="Password" />

              <button type="button" className="btn-primary" onClick={handleLogin}>
                Sign In
              </button>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text">OR</div>
                <div className="divider-line"></div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveTab("signup")}
              >
                Create an account
              </button>
            </div>
          )}

          {/* Sign Up */}
          {activeTab === "signup" && (
            <div className="form-panel active">
              <input type="text" placeholder="Full Name" />

              <input type="text" placeholder="Student Number" />

              <input type="password" placeholder="Password" />

              <button type="button" className="btn-primary" onClick={handleLogin}>
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
                onClick={() => setActiveTab("signin")}
              >
                Already have an account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;