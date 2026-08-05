import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Products.css"; 
import Navbar from '../components/Navbar';

const PRODUCTS = [
  { id: 'crop', category: 'crop', name: "ICT Crop", sub: "Women's Fit", price: 130, discPrice: 104, emoji: "👚", bg: "teal" },
  { id: 'classic', category: 'tshirt', name: "ICT Classic", sub: "Unisex", price: 150, discPrice: 120, emoji: "👕", bg: "navy" },
  { id: 'custom', category: 'tshirt', name: "Custom Print", sub: "Name + Language", price: 200, discPrice: 160, emoji: "🖨️", bg: "orange" },
  { id: 'oversized', category: 'oversized', name: "ICT Oversized", sub: "Unisex", price: 180, discPrice: 144, emoji: "🧥", bg: "light" }
];

const CART_KEY = "ict_branded_cart";

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
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const addToCart = (product, e) => {
    // Prevent clicking the button from firing card-level click events
    if (e) e.stopPropagation();

    const updatedCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    saveCart(updatedCart);

    // Show Toast
    setToastMessage(product.name);
    setShowToast(true);
  };

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
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
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
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="hero-title">ICT <span>Branded</span> Clothes</div>
          <div className="hero-sub">CODE. CONNECT. CREATE</div>
        </div>
        <div className="discount-pill">-20% Student</div>
      </div>

      <div className="filter-bar">
        {[
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
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        ✅ <span id="toast-item">{toastMessage}</span> added to cart!
      </div>
    </>
  );
}
