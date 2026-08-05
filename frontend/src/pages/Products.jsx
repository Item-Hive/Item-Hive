import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard"; 
import "../styles/Products.css";

const PRODUCTS = [
  {
    id: "white-tee",
    name: "ItemHive White Tee",
    color: "White",
    description: "Classic ICT-branded T-shirt in crisp white.",
    price: 200,
    sizes: "S, M, L, XL",
    rating: 4.5,
    image: "/assets/back-white-tshirt.JPG" 
  },
  {
    id: "orange-tee",
    name: "ICT Orange Tee",
    color: "Orange",
    description: "Bright orange tee with bold ICT branding.",
    price: 150,
    sizes: "S, M, L, XL",
    rating: 4.2,
    image: "/assets/back-orange-tshirt.JPG"
  },
  {
    id: "navy-tee",
    name: "ICT Navy Tee",
    color: "Blue",
    description: "Navy tee for a modern ICT look.",
    price: 250,
    sizes: "S, M, L, XL",
    rating: 4.7,
    image: "/assets/back-navy-tshirt.JPG"
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

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();

    const updatedCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    saveCart(updatedCart);

    setToastMessage(product.name);
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
    <>
      <nav className="products-nav">
        <div className="nav-logo">
          ICT <span>Branded</span>
        </div>
        <div className="nav-right">
          <span className="nav-student">230036937</span>
          <button className="nav-cart" onClick={() => goToCheckout()}>
            🛒 Cart (<span id="cart-count">{cartCount}</span>)
          </button>
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
        <div className="student-banner">
          <div className="banner-badge">-20% OFF</div>
          <div className="banner-text">
            Student discount applied! <strong>Save 20%</strong> with your valid student number.
          </div>
        </div>

        {/* --- PRODUCT GRID USING ProductCard COMPONENT --- */}
        <div className="product-grid" id="product-grid">
          {filteredProducts.map((product) => {
            const qty = cart[product.id] || 0;

            // Mapping your existing product object to match ProductCard props
            const cardData = {
              id: product.id,
              title: product.name,
              price: product.discPrice,
              category: product.category,
              description: `${product.sub} - Student Special`,
              emoji: product.emoji,
              bg: product.bg,
              origPrice: product.origPrice,
            };

            return (
              <ProductCard
                key={product.id}
                product={cardData}
                quantity={qty}
                onAddToCart={(e) => addToCart(product, e)}
                onCardClick={() => goToCheckout(product)}
              />
            );
          })}
        </div>
      </div>

      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        ✅ <span id="toast-item">{toastMessage}</span> added to cart!
      </div>
    </>
  );
}