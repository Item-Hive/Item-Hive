import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navbar"; // Adjust path to your Sidebar component

function MainLayout() {
  const SIDEBAR_WIDTH = "300px"; // Match this to your sidebar's width

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0b1120" }}>
      {/* Fixed Sidebar */}
      <div
        style={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content Area - Pushed to the right so sidebar won't overlap */}
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          padding: "24px",
          minHeight: "100vh",
          backgroundColor: "#0b1120", // Matches dark theme so text is visible
          color: "#f8fafc",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;