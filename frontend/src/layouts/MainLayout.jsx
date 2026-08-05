import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
          padding: "30px",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;