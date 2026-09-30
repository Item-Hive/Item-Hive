import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home"; 
import Products from "../pages/Products";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import OrderStatus from "../pages/OrderStatus";
import BrandGuidelines from "../pages/BrandGuidelines";
import ReportRefund from "../pages/ReportRefund";
import VerifyEmail from "../pages/VerifyEmail";
import ContactUs from "../pages/ContactUs";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* App Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/brand-guidelines" element={<BrandGuidelines />} />
        <Route path="/report-refund" element={<ReportRefund />} />
        <Route path="/contact" element={<ContactUs />} /> {/* 2. Add Contact Route */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        

        {/* Fallback Route */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
