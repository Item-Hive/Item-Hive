import { Routes, Route } from "react-router-dom"; // <-- Removed BrowserRouter import

import MainLayout from "../layouts/MainLayout";

import Products from "../pages/Products";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import BrandGuidelines from "../pages/BrandGuidelines";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* App Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/brand-guidelines" element={<BrandGuidelines />} />

        {/* Fallback Route */}
        <Route path="*" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;