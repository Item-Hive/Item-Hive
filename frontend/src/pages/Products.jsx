import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Products.css";

const PRODUCTS = [
  {
    id: "crop",
    category: "crop",
    name: "ICT Crop",
    sub: "Women's Fit",
    origPrice: 130,
    discPrice: 104,
    emoji: "👚",
    bg: "teal",
  },
  {
    id: "classic",
    category: "tshirt",
    name: "ICT Classic",
    sub: "Unisex",
    origPrice: 150,
    discPrice: 120,
    emoji: "👕",
    bg: "navy",
  },
  {
    id: "custom",
    category: "tshirt",
    name: "Custom Print",
    sub: "Name + Language",
    origPrice: 200,
    discPrice: 160,
    emoji: "🖨️",
    bg: "orange",
  },
  {
    id: "oversized",
    category: "oversized",
    name: "ICT Oversized",
    sub: "Unisex",
    origPrice: 180,
    discPrice: 144,
    emoji: "🧥",
    bg: "light",
  },
];

const CART_KEY = "ict_branded_cart";

function Products() {
  const [cart, setCart] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Sync cart state if modified in another tab
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : {});
        } catch (err) {
          console.error("Storage sync error", err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const updatedCart = {
      ...cart,
      [product.id]: (cart[product.id] || 0) + 1,
    };
    saveCart(updatedCart);

    // Show Toast
    setToastMessage(product.name);
    setShowToast(true);
  };

  // Hide toast automatically after 2s
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, toastMessage]);

  const totalCartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const filteredProducts = PRODUCTS.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <div>
      <nav className="products-nav">
        <div className="nav-logo">
          ICT <span>Branded</span>
        </div>
        <div className="nav-right">
          <span className="nav-student">230036937</span>
          <Link className="nav-cart" to="/checkout">
            🛒 Cart (<span>{totalCartCount}</span>)
          </Link>
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="hero-title">
            ICT <span>Branded</span> Clothes
          </div>
          <div className="hero-sub">CODE. CONNECT. CREATE</div>
        </div>
        <div className="discount-pill">-20% Student</div>
      </div>

      <div className="filter-bar">
        {[
          { key: "all", label: "All" },
          { key: "tshirt", label: "T-Shirts" },
          { key: "crop", label: "Crop Tops" },
          { key: "oversized", label: "Oversized" },
        ].map((btn) => (
          <button
            key={btn.key}
            className={`filter-btn ${activeFilter === btn.key ? "active" : ""}`}
            onClick={() => setActiveFilter(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="products-page-body">
        <div className="student-banner">
          <div className="banner-badge">-20% OFF</div>
          <div className="banner-text">
            Student discount applied! <strong>Save 20%</strong> with your valid
            student number.
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div className="product-card" key={p.id}>
                <div className={`product-img ${p.bg}`}>
                  {p.emoji}
                  <div className="discount-tag">-20%</div>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-sub">{p.sub}</div>
                  <div className="product-footer">
                    <div className="price-wrap">
                      <span className="price-orig">R{p.origPrice}</span>
                      <span className="price-disc">R{p.discPrice}</span>
                    </div>
                    <button
                      className={`add-btn ${qty > 0 ? "in-cart" : ""}`}
                      onClick={() => addToCart(p)}
                    >
                      {qty > 0 ? `✓ In Cart (${qty})` : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        ✅ <span>{toastMessage}</span> added to cart!
      </div>
    </div>
  );
}

export default Products;