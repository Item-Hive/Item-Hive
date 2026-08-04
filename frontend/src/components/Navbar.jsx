import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <nav
      style={{
        background: "#18245F",
        color: "white",
        width: "220px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "30px 20px",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
    
      <img
        src="https://item-hive.github.io/src/Blue%20Playful%20Handwriting%20Creative%20Studio%20Logo%20(1).png"
        width="100px"
        height="100px"
        alt="logo"
        style={{ margin: "40px", borderRadius: "50%" }}
       
      />

     
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          width: "100%",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          
          Dashboard
        </Link>

        <Link to="/Products" style={linkStyle}>
         
          Products
        </Link>

        <Link to="/Checkout" style={linkStyle}>
          
          Orders
        </Link>

        <Link to="/analytics" style={linkStyle}>
          
          Analytics
        </Link>

        <Link to="/Profile" style={linkStyle}>
         
          <span >Profile</span>
        </Link>
      </div>
      <button id="logout-btn" type="button" style={linkStyle} onClick={() => {
        <Link to="/Login" style={linkStyle}></Link>
      }}>
        Logout
      </button>
    </nav>
  );
}

const linkStyle = {
  color: white ,
  textDecoration: "none",
  fontSize: "16px",
  padding: "10px 15px",
  borderRadius: "8px",
  transition: "background 0.3s",
};



export default Sidebar;
