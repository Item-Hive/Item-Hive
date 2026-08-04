import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#18245F",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 28px",
      }}
    >
      <h2>
        Item <span style={{ color: "#FF751F" }}>Hive</span>
      </h2>

      <div
        style={{
          display: "flex",
          gap: "25px",
        }}
      >
        <Link to="/products">Products</Link>

        <Link to="/profile">My Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;