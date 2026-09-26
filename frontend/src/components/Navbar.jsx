import { Link, useNavigate, useLocation } from "react-router-dom";

const USER_KEY = "ict_branded_user";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  };

  const user = getLoggedInUser();
  const isLoggedIn = !!user?.id;

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        background: "#FFFFFF",
        color: "#0F172A",
        width: "220px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "30px 16px",
        position: "fixed",
        top: 0,
        left: 0,
        boxSizing: "border-box",
        borderRight: "1px solid #E2E8F0",
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.03)",
        zIndex: 1000,
      }}
    >
      <div style={{ width: "100%", textAlign: "center", marginBottom: "30px" }}>
        <img
          src="https://item-hive.github.io/src/Blue%20Playful%20Handwriting%20Creative%20Studio%20Logo%20(1).png"
          width="80px"
          height="80px"
          alt="logo"
          style={{
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <h3 style={{ fontSize: "18px", color: "#F97316", marginTop: "10px", fontWeight: "700" }}>
          Item<span style={{ color: "#0F172A" }}>Hive</span>
        </h3>
        {isLoggedIn && (
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "6px" }}>
            Hi, {user.firstName || "there"}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
        }}
      >
        <Link to="/" style={getLinkStyle(isActive("/"))}>
          Home
        </Link>
        <Link to="/brand-guidelines" style={getLinkStyle(isActive("/brand-guidelines"))}>
          Brand Guidelines
        </Link>
        <Link to="/products" style={getLinkStyle(isActive("/products"))}>
          Products
        </Link>
        <Link to="/checkout" style={getLinkStyle(isActive("/checkout"))}>
          Orders
        </Link>
        {isLoggedIn && (
          <Link to="/profile" style={getLinkStyle(isActive("/profile"))}>
            Profile
          </Link>
        )}
      </div>

      <div style={{ marginTop: "auto", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
        {isLoggedIn ? (
          <button id="logout-btn" type="button" onClick={handleLogout} style={logoutBtnStyle}>
            Logout
          </button>
        ) : (
          <button id="login-btn" type="button" onClick={handleLogin} style={loginBtnStyle}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const getLinkStyle = (active) => ({
  color: active ? "#F97316" : "#475569",
  background: active ? "#FFF7ED" : "transparent",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: active ? "700" : "500",
  padding: "12px 16px",
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out",
  display: "block",
  borderLeft: active ? "3px solid #F97316" : "3px solid transparent",
});

const loginBtnStyle = {
  color: "#FFFFFF",
  background: "#F97316",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(249, 115, 22, 0.25)",
  transition: "all 0.2s ease",
};

const logoutBtnStyle = {
  color: "#334155",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
  transition: "all 0.2s ease",
};

export default Navbar;