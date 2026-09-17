import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

const CATALOG = {
  crop: { name: "ICT Crop", sub: "Women's Fit", price: 130, emoji: "👚", bg: "teal" },
  classic: { name: "ICT Classic", sub: "Unisex", price: 150, emoji: "👕", bg: "navy" },
  custom: { name: "Custom Print", sub: "Name + Language", price: 200, emoji: "🖨️", bg: "orange" },
  oversized: { name: "ICT Oversized", sub: "Unisex", price: 180, emoji: "🧥", bg: "light" },
};

const CART_KEY = "ict_branded_cart";
const DISCOUNT = 0.2;

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [delivery, setDelivery] = useState("pickup");
  const [payment, setPayment] = useState("YOCO");
  const [confirmation, setConfirmation] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Sync cart across browser tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CART_KEY && !confirmation) {
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
  }, [confirmation]);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const money = (n) => "R" + (n % 1 === 0 ? n : n.toFixed(2));

=======
          setCart({});
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [confirmation]);

  // Derive item calculations from cart state
>>>>>>> origin/main
  const items = Object.keys(cart)
    .filter((id) => cart[id] > 0 && CATALOG[id])
    .map((id) => {
      const p = CATALOG[id];
      const qty = cart[id];
      return {
        id,
        qty,
        name: p.name,
        sub: p.sub,
        emoji: p.emoji,
        bg: p.bg,
        price: p.price,
        origLineTotal: p.price * qty,
<<<<<<< HEAD
        lineTotal: Math.round(p.price * (1 - DISCOUNT)) * qty,
      };
    });

=======
        lineTotal: Math.round(p.price * (1 - DISCOUNT)) * qty
      };
    });

  const subtotal = items.reduce((s, i) => s + i.origLineTotal, 0);
  const discountAmount = Math.round(subtotal * DISCOUNT);
  const total = subtotal - discountAmount;

  // Handlers
>>>>>>> origin/main
  const updateQty = (id, newQty) => {
    const updated = { ...cart };
    if (newQty <= 0) {
      delete updated[id];
    } else {
      updated[id] = newQty;
    }
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = { ...cart };
    delete updated[id];
    saveCart(updated);
  };

<<<<<<< HEAD
  const subtotal = items.reduce((s, i) => s + i.origLineTotal, 0);
  const discountAmount = Math.round(subtotal * DISCOUNT);
  const total = subtotal - discountAmount;

  const placeOrder = () => {
    setConfirmation({ total, payment });
    saveCart({}); // clear cart on purchase
  };

  return (
    <div>
      <nav className="checkout-nav">
        <Link className="nav-back" to="/products">
          ← Back
        </Link>
        <span className="nav-title">Checkout</span>
        <span className="nav-logo">
          ICT <span>Branded</span>
        </span>
      </nav>

      <div className="checkout-page">
        {/* Order Confirmation Screen */}
        {confirmation ? (
          <div className="confirm-card">
            <div className="confirm-emoji">🎉</div>
            <div className="confirm-title">Order placed!</div>
            <div className="confirm-detail">
              Total charged: <strong>{money(confirmation.total)}</strong> via{" "}
              {confirmation.payment}
            </div>
            <button className="confirm-btn" onClick={() => navigate("/products")}>
              Continue shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart Screen */
          <div className="empty-state">
            <div className="empty-emoji">🛒</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-sub">Add something from the shop first.</div>
            <button className="empty-btn" onClick={() => navigate("/products")}>
              Browse products
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div className="student-banner">
              <div className="banner-badge">-20% OFF</div>
              <div>Student discount applied with your valid student number!</div>
            </div>

            <div className="card">
              <div className="card-head">Order Summary</div>
              <div className="card-body">
                {items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-left">
                      <div className={`item-dot ${item.bg}`}>{item.emoji}</div>
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-sub">{item.sub}</div>
                      </div>
                    </div>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-price">{money(item.lineTotal)}</div>
                    <button
                      className="remove-btn"
                      title="Remove"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">Delivery / Pickup</div>
              <div className="card-body">
                <div className="del-grid">
                  <div
                    className={`del-opt ${delivery === "pickup" ? "active" : ""}`}
                    onClick={() => setDelivery("pickup")}
                  >
                    <div className="del-name">Campus Pickup</div>
                    <div className="del-desc">ICT Reception</div>
                    <div className="del-price">FREE</div>
                  </div>
                  <div
                    className={`del-opt ${delivery === "courier" ? "active" : ""}`}
                    onClick={() => setDelivery("courier")}
                  >
                    <div className="del-name">Delivery</div>
                    <div className="del-desc">Standard courier</div>
                    <div className="del-price">FREE</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">Payment Method</div>
              <div className="card-body">
                <div className="pay-row">
                  {["YOCO", "SnapScan", "EFT"].map((method) => (
                    <button
                      key={method}
                      className={`pay-opt ${payment === method ? "active" : ""}`}
                      onClick={() => setPayment(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">Price Breakdown</div>
              <div className="card-body">
                {items.map((item) => (
                  <div className="total-row" key={item.id}>
                    <span>
                      {item.name}
                      {item.qty > 1 ? ` × ${item.qty}` : ""}
                    </span>
                    <span>{money(item.origLineTotal)}</span>
                  </div>
                ))}
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="total-row discount">
                  <span>
                    Student Discount <span className="disc-badge">-20%</span>
                  </span>
                  <span>-{money(discountAmount)}</span>
                </div>
                <div className="total-row final">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
            </div>

            <button className="order-btn" onClick={placeOrder}>
              Place Order — {money(total)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
=======
  const placeOrder = () => {
    setConfirmation({ total, payment });
    saveCart({}); // clear shared cart
  };

  const goToProducts = () => {
    // If using React Router:
    navigate('/products');
    // Or fallback to direct redirect:
    // window.location.href = "products.html";
  };

  // ── 1. Confirmation View ──
  if (confirmation) {
    return (
      <div className="page" id="page-content">
        <div className="confirm-card">
          <div className="confirm-emoji">🎉</div>
          <div className="confirm-title">Order placed!</div>
          <div className="confirm-detail">
            Total charged: <strong>{money(confirmation.total)}</strong> via {confirmation.payment}
          </div>
          <button className="confirm-btn" onClick={goToProducts}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  // ── 2. Empty Cart View ──
  if (items.length === 0) {
    return (
      <div className="page" id="page-content">
        <div className="empty-state">
          <div className="empty-emoji">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-sub">Add something from the shop first.</div>
          <button className="empty-btn" onClick={goToProducts}>
            Browse products
          </button>
        </div>
      </div>
    );
  }

  // ── 3. Full Checkout View ──
  return (
    <div className="page" id="page-content">
      <div className="student-banner">
        <div className="banner-badge">-20% OFF</div>
        <div>Student discount applied with your valid student number!</div>
      </div>

      <div className="card">
        <div className="card-head">Order Summary</div>
        <div className="card-body">
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-left">
                <div className={`item-dot ${item.bg}`}>{item.emoji}</div>
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-sub">{item.sub}</div>
                </div>
              </div>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <div className="item-price">{money(item.lineTotal)}</div>
              <button className="remove-btn" title="Remove" onClick={() => removeItem(item.id)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head">Delivery / Pickup</div>
        <div className="card-body">
          <div className="del-grid">
            <div
              className={`del-opt ${delivery === 'pickup' ? 'active' : ''}`}
              onClick={() => setDelivery('pickup')}
            >
              <div className="del-name">Campus Pickup</div>
              <div className="del-desc">ICT Reception</div>
              <div className="del-price">FREE</div>
            </div>
            <div
              className={`del-opt ${delivery === 'courier' ? 'active' : ''}`}
              onClick={() => setDelivery('courier')}
            >
              <div className="del-name">Delivery</div>
              <div className="del-desc">Standard courier</div>
              <div className="del-price">FREE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">Payment Method</div>
        <div className="card-body">
          <div className="pay-row">
            {['YOCO', 'SnapScan', 'EFT'].map((method) => (
              <button
                key={method}
                className={`pay-opt ${payment === method ? 'active' : ''}`}
                onClick={() => setPayment(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">Price Breakdown</div>
        <div className="card-body">
          {items.map((item) => (
            <div key={item.id} className="total-row">
              <span>
                {item.name}
                {item.qty > 1 ? ` × ${item.qty}` : ''}
              </span>
              <span>{money(item.origLineTotal)}</span>
            </div>
          ))}
          <div className="total-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="total-row discount">
            <span>
              Student Discount <span className="disc-badge">-20%</span>
            </span>
            <span>-{money(discountAmount)}</span>
          </div>
          <div className="total-row final">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </div>

      <button className="order-btn" onClick={placeOrder}>
        Place Order — {money(total)}
      </button>
    </div>
  );
}
>>>>>>> origin/main
