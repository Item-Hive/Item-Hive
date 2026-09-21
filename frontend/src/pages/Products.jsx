import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import whiteTee from "../assets/back-white-tshirt.JPG";
import orangeTee from "../assets/back-orange-tshirt.JPG";
import navyTee from "../assets/back-navy-tshirt.JPG";
import navyHoodie from "../assets/navy-oversize-hoodie.jpeg";
import orangeCrop from "../assets/orange-crop-top.jpeg";
import pinkCrop from "../assets/pink-crop-top.jpeg";

const CART_KEY = "ict_branded_cart";
const API_URL = import.meta.env.VITE_API_URL;
const DISCOUNT = 0.2;
const SIZES = ["XS", "S", "M", "L", "XL"];

const FALLBACK_IMAGES = [whiteTee, orangeTee, navyTee];

// Checked in order; the first rule whose words all appear in the product name wins
const IMAGE_RULES = [
  { words: ["navy", "hoodie"], image: navyHoodie },
  { words: ["navy", "oversize"], image: navyHoodie },
  { words: ["orange", "crop"], image: orangeCrop },
  { words: ["pink", "crop"], image: pinkCrop },
  { words: ["white"], image: whiteTee },
  { words: ["orange"], image: orangeTee },
  { words: ["navy"], image: navyTee },
];

const getLocalImage = (name = "") => {
  const n = name.toLowerCase();
  return IMAGE_RULES.find((r) => r.words.every((w) => n.includes(w)))?.image;
};

const cartKeyFor = (productId, size) => `${productId}::${size}`;

// Maps whatever the backend calls a category onto the filter keys used by the buttons
const getCategoryKey = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("crop")) return "crop";
  if (n.includes("oversize") || n.includes("hoodie")) return "oversized";
  if (n.includes("shirt") || n.includes("tee")) return "tshirt";
  return n;
};

// "Admin" for admin logins, "Student" for student logins, "Guest" if nobody is logged in
const getUserLabel = (user) => {
  if (!user) return "Guest";
  const role = String(user.role || "").toLowerCase();
  const id = String(user.idNumber || user.studentNumber || "").toUpperCase();
  const isAdmin = role === "admin" || id.startsWith("ADM");
  return isAdmin ? "Admin" : "Student";
};

export default function Products() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Product currently open in the detail popup, plus the size chosen in it
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

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
          category: getCategoryKey(item.category?.name || item.name),
          color: item.category?.name || "",
          description: item.description,
          price: item.price,
          origPrice: null,
          sizes: SIZES.join(", "),
          rating: item.rating,
          image:
            item.imageUrl ||
            getLocalImage(item.name) ||
            FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Close the popup with Escape
  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e) => e.key === "Escape" && closeProduct();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProduct]);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setSizeError(false);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setSizeError(false);
  };

  const addToCart = async (product, size) => {
    if (!product?.id) return;

    const key = cartKeyFor(product.id, size);
    const updatedCart = { ...cart, [key]: (cart[key] || 0) + 1 };
    saveCart(updatedCart);
    setToastMessage(`${product.name} (${size})`);
    setShowToast(true);

    const quantity = updatedCart[key];
    const subtotal = product.price * quantity;
    const serviceFee = 0;

    const cartEntry = {
      id: crypto.randomUUID(),
      itemName: `${product.name} (${size})`,
      price: product.price,
      quantity,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
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

  const confirmAdd = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    const product = selectedProduct;
    const size = selectedSize;
    closeProduct();
    await addToCart(product, size);
  };

  const goToCheckout = () => {
    navigate("/checkout", { state: { cart } });
  };

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
          <span className="nav-student">{getUserLabel(loggedInUser)}</span>
          <button className="nav-cart" onClick={goToCheckout}>
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
            <div
              key={product.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "fit-content",
              }}
            >
              {/* The card's add button opens the popup so a size is always chosen */}
              <ProductCard
                product={product}
                onAddToCart={(e) => {
                  if (e?.stopPropagation) e.stopPropagation();
                  openProduct(product);
                }}
              />
              <button
                onClick={() => openProduct(product)}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #FF6B00",
                  background: "#fff",
                  color: "#FF6B00",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div
          onClick={closeProduct}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "20px",
            }}
          >
            <button
              onClick={closeProduct}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <h3 style={{ margin: "14px 0 4px" }}>{selectedProduct.name}</h3>
            {selectedProduct.description && (
              <p style={{ margin: "0 0 10px", color: "#64748B" }}>
                {selectedProduct.description}
              </p>
            )}

            <p style={{ margin: "0 0 14px" }}>
              <strong style={{ color: "#FF6B00", fontSize: "1.2rem" }}>
                R{Math.round(selectedProduct.price * (1 - DISCOUNT))}
              </strong>{" "}
              <span style={{ color: "#94A3B8", textDecoration: "line-through" }}>
                R{selectedProduct.price}
              </span>{" "}
              <span style={{ fontSize: "0.8rem", color: "#64748B" }}>student price</span>
            </p>

            <div style={{ fontWeight: 600, marginBottom: "6px" }}>Select size</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  aria-pressed={selectedSize === size}
                  style={{
                    minWidth: "44px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${selectedSize === size ? "#FF6B00" : "#CBD5E1"}`,
                    background: selectedSize === size ? "#FF6B00" : "#fff",
                    color: selectedSize === size ? "#fff" : "#0F172A",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p style={{ color: "red", margin: "8px 0 0", fontSize: "0.85rem" }}>
                Please select a size.
              </p>
            )}

            <button
              onClick={confirmAdd}
              style={{
                width: "100%",
                marginTop: "18px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#FF6B00",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      )}

      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        <span className="toast-icon">🛍️</span>
        <span>
          <strong>{toastMessage}</strong> added to cart!
        </span>
      </div>
    </div>
  );
}