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

<<<<<<< HEAD
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
=======
export default function Products() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Sync state with LocalStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  // Sync changes across tabs
>>>>>>> origin/main
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : {});
        } catch (err) {
<<<<<<< HEAD
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
=======
          setCart({});
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const addToCart = (product, e) => {
    // Prevent clicking the button from firing card-level click events
    if (e) e.stopPropagation();

    const updatedCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
>>>>>>> origin/main
    saveCart(updatedCart);

    // Show Toast
    setToastMessage(product.name);
    setShowToast(true);
  };

<<<<<<< HEAD
  // Hide toast automatically after 2s
=======
  // Direct checkout handler (navigates & sends cart/item info)
  const goToCheckout = (product = null) => {
    let currentCart = cart;

    // If clicking a specific product directly, ensure at least 1 is in cart before navigating
    if (product) {
      if (!currentCart[product.id]) {
        currentCart = { ...cart, [product.id]: 1 };
        saveCart(currentCart);
      }
    }

    // Navigate to checkout and optionally pass current cart in router state
    navigate('/checkout', { state: { cart: currentCart, selectedProduct: product } });
  };

  // Auto-hide toast after 2 seconds
>>>>>>> origin/main
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
<<<<<<< HEAD
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
=======
  }, [showToast]);

  const filteredProducts = activeFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <>
      <nav>
        <div className="nav-logo">ICT <span>Branded</span></div>
        <div className="nav-right">
          <span className="nav-student">230036937</span>
          {/* Nav Cart Button takes whole cart to Checkout */}
          <button className="nav-cart" onClick={() => goToCheckout()}>
            🛒 Cart (<span id="cart-count">{cartCount}</span>)
          </button>
>>>>>>> origin/main
        </div>
      </nav>

      <div className="hero">
        <div>
<<<<<<< HEAD
          <div className="hero-title">
            ICT <span>Branded</span> Clothes
          </div>
=======
          <div className="hero-title">ICT <span>Branded</span> Clothes</div>
>>>>>>> origin/main
          <div className="hero-sub">CODE. CONNECT. CREATE</div>
        </div>
        <div className="discount-pill">-20% Student</div>
      </div>

      <div className="filter-bar">
        {[
<<<<<<< HEAD
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
=======
          { key: 'all', label: 'All' },
          { key: 'tshirt', label: 'T-Shirts' },
          { key: 'crop', label: 'Crop Tops' },
          { key: 'oversized', label: 'Oversized' }
        ].map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
>>>>>>> origin/main
          </button>
        ))}
      </div>

<<<<<<< HEAD
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
=======
      <div className="page-body">
        <div className="student-banner">
          <div className="banner-badge">-20% OFF</div>
          <div className="banner-text">
            Student discount applied! <strong>Save 20%</strong> with your valid student number.
          </div>
        </div>

        <div className="product-grid" id="product-grid">
          {filteredProducts.map(product => {
            const qty = cart[product.id] || 0;
            const inCart = qty > 0;

            return (
               <nav>
        <Navbar/>
        
      
      </nav>
              <div 
                key={product.id} 
                className="product-card" 
                data-category={product.category}
                style={{ cursor: 'pointer' }}
                onClick={() => goToCheckout(product)} // 👈 Clicking the card takes user to Checkout!
              >
                <div className={`product-img ${product.bg}`}>
                  {product.emoji}
                  <div className="discount-tag">-20%</div>
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-sub">{product.sub}</div>
                  <div className="product-footer">
                    <div className="price-wrap">
                      <span className="price-orig">R{product.price}</span>
                      <span className="price-disc">R{product.discPrice}</span>
                    </div>
                    <button
                      className={`add-btn ${inCart ? 'in-cart' : ''}`}
                      onClick={(e) => addToCart(product, e)} // 👈 Keeps '+ Add' working without opening checkout immediately
                    >
                      {inCart ? `✓ In Cart (${qty})` : '+ Add'}
>>>>>>> origin/main
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

<<<<<<< HEAD
      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        ✅ <span>{toastMessage}</span> added to cart!
      </div>
    </div>
  );
}

export default Products;
=======
      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        ✅ <span id="toast-item">{toastMessage}</span> added to cart!
      </div>
    </>
  );
}
>>>>>>> origin/main
