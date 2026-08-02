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

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Everything else */}
        <Route element={<MainLayout />}>

          <Route path="/products" element={<Products />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/checkout" element={<Checkout />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;