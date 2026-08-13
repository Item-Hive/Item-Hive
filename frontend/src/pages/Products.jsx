import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard"; 
import "../styles/Products.css";
import whiteTee from "../assets/back-white-tshirt.JPG";
import orangeTee from "../assets/back-orange-tshirt.JPG";
import navyTee from "../assets/back-navy-tshirt.JPG";

const PRODUCTS = [
  {
    id: "white-tee",
    name: "ItemHive White Tee",
    category: "tshirt",
    color: "White",
    description: "Classic ICT-branded T-shirt in crisp white.",
    price: 200,
    origPrice: 250,
    sizes: "S, M, L, XL",
    rating: 4.5,
    image: whiteTee
  },
  {
    id: "orange-tee",
    name: "ICT Orange Tee",
    category: "tshirt",
    color: "Orange",
    description: "Bright orange tee with bold ICT branding.",
    price: 150,
    origPrice: 190,
    sizes: "S, M, L, XL",
    rating: 4.2,
    image: orangeTee
  },
  {
    id: "navy-tee",
    name: "ICT Navy Tee",
    category: "tshirt",
    color: "Blue",
    description: "Navy tee for a modern ICT look.",
    price: 250,
    origPrice: 300,
    sizes: "S, M, L, XL",
    rating: 4.7,
    image: navyTee
  }
];

const CART_KEY = "ict_branded_cart";

export default function Products() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Initialize state from LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Sync state with LocalStorage helper
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  // Sync changes across browser tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : {});
        } catch (err) {
          setCart({});
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Safely handles adding items to cart
  const addToCart = (product, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    const productId = product?.id;
    const productName = product?.name || "Item";

    if (!productId) return;

    const updatedCart = {
      ...cart,
      [productId]: (cart[productId] || 0) + 1,
    };

    saveCart(updatedCart);
    setToastMessage(productName);
    setShowToast(true);
  };

  const goToCheckout = (product = null) => {
    let currentCart = cart;

    if (product) {
      if (!currentCart[product.id]) {
        currentCart = { ...cart, [product.id]: 1 };
        saveCart(currentCart);
      }
    }

    navigate("/checkout", { state: { cart: currentCart, selectedProduct: product } });
  };

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const filteredProducts =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div className="products-container">
      {/* Top Header Bar */}
      <nav className="products-nav">
        <div className="nav-logo">
          Item<span>Hive</span>
        </div>
        <div className="nav-right">
          <span className="nav-student">Student #230036937</span>
          <button className="nav-cart" onClick={() => goToCheckout()}>
            🛒 Cart (<span id="cart-count">{cartCount}</span>)
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="hero">
        <div>
          <div className="hero-title">
            ICT <span>Branded</span> Apparel
          </div>
          <div className="hero-sub">CODE. CONNECT. CREATE</div>
        </div>
        <div className="discount-pill">-20% Student</div>
      </div>

      {/* Category Filters */}
      <div className="filter-bar">
        {[
          { key: "all", label: "All" },
          { key: "tshirt", label: "T-Shirts" },
          { key: "crop", label: "Crop Tops" },
          { key: "oversized", label: "Oversized" },
        ].map((filter) => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? "active" : ""}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="page-body">
        {/* Discount Notification Banner */}
        <div className="student-banner">
          <div className="banner-badge">-20% OFF</div>
          <div className="banner-text">
            Student discount active! <strong>Save 20%</strong> automatically with your registered student account.
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="product-grid" id="product-grid">
          {filteredProducts.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(e) => addToCart(product, e)}
              />
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        <span className="toast-icon">🛍️</span>
        <span>
          <strong>{toastMessage}</strong> added to cart!
        </span>
      </div>
    </div>
  );
}