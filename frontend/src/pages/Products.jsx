import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import whiteTee from "../assets/back-white-tshirt.JPG";
import orangeTee from "../assets/back-orange-tshirt.JPG";
import navyTee from "../assets/back-navy-tshirt.JPG";

const CART_KEY = "ict_branded_cart";
const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_IMAGES = [whiteTee, orangeTee, navyTee];

export default function Products() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const loggedInUser = (() => {
    try {
      const raw = localStorage.getItem("ict_branded_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/item`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        const mapped = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          category: item.category?.name?.toLowerCase() || "tshirt",
          color: item.category?.name || "",
          description: item.description,
          price: item.price,
          origPrice: null,
          sizes: null,
          rating: item.rating,
          image: item.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        }));

        setItems(mapped);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setFetchError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

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

  const addToCart = async (product, e) => {
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

    const quantity = updatedCart[productId];
    const subtotal = product.price * quantity;
    const serviceFee = 0;
    const total = subtotal + serviceFee;

    const cartEntry = {
      id: crypto.randomUUID(),
      itemName: product.name,
      price: product.price,
      quantity,
      subtotal,
      serviceFee,
      total,
    };

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartEntry),
      });
      if (!res.ok) throw new Error(`Cart save failed: ${res.status}`);
    } catch (err) {
      console.error("Failed to save cart entry to backend:", err);
    }
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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const filteredProducts =
    activeFilter === "all"
      ? items
      : items.filter((p) => p.category === activeFilter);

  return (
    <div className="products-container">
      <nav className="products-nav">
        <div className="nav-logo">
          Item<span>Hive</span>
        </div>
        <div className="nav-right">
          <span className="nav-student">
            {loggedInUser
              ? `Student #${loggedInUser.studentNumber || loggedInUser.idNumber}`
              : "Guest"}
          </span>
          <button className="nav-cart" onClick={() => goToCheckout()}>
            🛒 Cart (<span id="cart-count">{cartCount}</span>)
          </button>
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="hero-title">
            ICT <span>Branded</span> Apparel
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
            Student discount active! <strong>Save 20%</strong> automatically with your registered student account.
          </div>
        </div>

        {loading && <p style={{ textAlign: "center" }}>Loading products...</p>}
        {fetchError && <p style={{ textAlign: "center", color: "red" }}>{fetchError}</p>}
        {!loading && !fetchError && filteredProducts.length === 0 && (
          <p style={{ textAlign: "center" }}>No products found.</p>
        )}

        <div className="product-grid" id="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(e) => addToCart(product, e)}
            />
          ))}
        </div>
      </div>

      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        <span className="toast-icon">🛍️</span>
        <span>
          <strong>{toastMessage}</strong> added to cart!
        </span>
      </div>
    </div>
  );
}