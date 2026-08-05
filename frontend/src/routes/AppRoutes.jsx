import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Products from "../pages/Products";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected / App Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* Fallback Route */}
        <Route path="*" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;