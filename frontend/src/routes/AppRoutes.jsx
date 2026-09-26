import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home"; 
import Products from "../pages/Products";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import BrandGuidelines from "../pages/BrandGuidelines";
import ReportRefund from "..ReportRefund/pages/ReportRefund";


function AppRoutes() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* App Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} /> {/* <-- 2. Change Products to Home */}
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/brand-guidelines" element={<BrandGuidelines />} />
        <Route path="/report-refund" element={<ReportRefund />} />
        {/* Fallback Route */}
        <Route path="*" element={<Home />} /> {/* <-- Optional: redirect unknown paths to Home */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
