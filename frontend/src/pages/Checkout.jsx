import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import YocoPayment from "../components/YocoPayment"; // 222567023 - Ricardo Mukwevho

const CART_KEY = "ict_branded_cart";
const DISCOUNT = 0.2;
const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [catalog, setCatalog] = useState({});
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [delivery, setDelivery] = useState("pickup");
  const [payment, setPayment] = useState("YOCO");
  const [confirmation, setConfirmation] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Fetch real items and build a lookup map by id
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/item`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        const map = {};
        data.forEach((item) => {
          map[item.id] = {
            name: item.name,
            sub: item.category?.name || "",
            price: item.price,
          };
        });
        setCatalog(map);
      } catch (err) {
        console.error("Failed to fetch catalog for checkout:", err);
      } finally {
        setLoadingCatalog(false);
      }
    };

    fetchCatalog();
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CART_KEY && !confirmation) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : {});
        } catch (err) {
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

  const items = Object.keys(cart)
    .filter((id) => cart[id] > 0 && catalog[id])
    .map((id) => {
      const p = catalog[id];
      const qty = cart[id];
      return {
        id,
        qty,
        name: p.name,
        sub: p.sub,
        price: p.price,
        origLineTotal: p.price * qty,
        lineTotal: Math.round(p.price * (1 - DISCOUNT)) * qty,
      };
    });

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

  const subtotal = items.reduce((s, i) => s + i.origLineTotal, 0);
  const discountAmount = Math.round(subtotal * DISCOUNT);
  const total = subtotal - discountAmount;

  const placeOrder = async () => {
    setPlacingOrder(true);
    setOrderError(null);

    try {
      // One invoice per cart line item, matching the current backend schema
      const invoicePromises = items.map((item) => {
        const invoicePayload = {
          id: crypto.randomUUID(),
          receipt: {
            itemName: item.name,
            price: item.price,
            quantity: item.qty,
            subtotal: item.origLineTotal,
            serviceFee: 0,
            total: item.lineTotal,
          },
        };

        return fetch(`${API_URL}/api/invoice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invoicePayload),
        });
      });

      const results = await Promise.all(invoicePromises);
      const failed = results.some((res) => !res.ok);

      if (failed) {
        throw new Error("One or more invoices failed to save");
      }

      setConfirmation({ total, payment });
      saveCart({});
    } catch (err) {
      console.error("Failed to place order:", err);
      setOrderError("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-container">
      <nav className="checkout-nav">
        <Link className="nav-back" to="/products">← Back to Shop</Link>
        <span className="nav-title">Checkout</span>
        <span className="nav-logo">Item<span>Hive</span></span>
      </nav>

      <div className="checkout-page">
        {confirmation ? (
          <div className="confirm-card">
            <div className="confirm-emoji">🎉</div>
            <div className="confirm-title">Order Placed Successfully!</div>
            <div className="confirm-detail">
              Total charged: <strong>{money(confirmation.total)}</strong> via <span>{confirmation.payment}</span>
            </div>
            <button className="confirm-btn" onClick={() => navigate("/products")}>Continue Shopping</button>
          </div>
        ) : loadingCatalog ? (
          <div className="empty-state">
            <div className="empty-title">Loading your order...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🛒</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-sub">Explore our ICT gear and add items to your cart!</div>
            <button className="empty-btn" onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="student-banner">
              <div className="banner-badge">-20% OFF</div>
              <div>Student discount auto-applied to your order!</div>
            </div>

            <div className="card">
              <div className="card-head">Order Summary</div>
              <div className="card-body">
                {items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-left">
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
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">Delivery / Pickup Option</div>
              <div className="card-body">
                <div className="del-grid">
                  <div className={`del-opt ${delivery === "pickup" ? "active" : ""}`} onClick={() => setDelivery("pickup")}>
                    <div className="del-name">Campus Pickup</div>
                    <div className="del-desc">ICT Department Reception</div>
                    <div className="del-price">FREE</div>
                  </div>
                  <div className={`del-opt ${delivery === "courier" ? "active" : ""}`} onClick={() => setDelivery("courier")}>
                    <div className="del-name">Standard Delivery</div>
                    <div className="del-desc">Direct to your residence</div>
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
                    <button key={method} className={`pay-opt ${payment === method ? "active" : ""}`} onClick={() => setPayment(method)}>{method}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">Price Breakdown</div>
              <div className="card-body">
                {items.map((item) => (
                  <div className="total-row" key={item.id}>
                    <span>{item.name} {item.qty > 1 ? `× ${item.qty}` : ""}</span>
                    <span>{money(item.origLineTotal)}</span>
                  </div>
                ))}
                <div className="total-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="total-row discount"><span>Student Discount <span className="disc-badge">-20%</span></span><span>-{money(discountAmount)}</span></div>
                <div className="total-row final"><span>Total</span><span>{money(total)}</span></div>
              </div>
            </div>

            {orderError && (
              <p style={{ color: "red", textAlign: "center" }}>{orderError}</p>
            )}

            <button className="order-btn" onClick={placeOrder} disabled={placingOrder}>
              {placingOrder ? "Placing Order..." : `Place Order — ${money(total)}`}
            </button>

            <div style={{ marginTop: '20px' }}>
              <YocoPayment amount={total} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;