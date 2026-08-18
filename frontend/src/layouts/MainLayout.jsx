import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navbar";

function MainLayout() {
  const SIDEBAR_WIDTH = "220px"; // Fixed: Matches actual navbar width (no more 80px black bar!)

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
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

      {/* Main Content Area */}
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          padding: "24px",
          minHeight: "100vh",
          backgroundColor: "#f8fafc", // Fixed: Light theme canvas
          color: "#0f172a",          // Fixed: Dark text for light mode
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;