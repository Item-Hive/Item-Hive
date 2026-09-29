import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import YocoPayment from "../components/YocoPayment";
import EFTPayment from "../components/EFTPayment";

const CART_KEY = "ict_branded_cart";
const USER_KEY = "ict_branded_user";
const DISCOUNT = 0.2;
const API_URL = import.meta.env.VITE_API_URL;
const BANKS = ["FNB", "Standard Bank", "ABSA", "Nedbank", "Capitec"];
const PAYMENT_METHODS = ["YOCO", "EFT"];

const RESIDENCE_GROUPS = [
  {
    label: "Bellville Campus",
    options: [
      "Bellville Campus Residences", "Anglo American Residence", "De Beers Residence (East Wing)",
      "De Goede Hoop Residence", "Freedom Square 1 & 2", "Heroes House", "Kruskal", "MGR 1", "MGR 2",
      "New 200 Beds Residence", "Post Graduate Residence", "Richard Sacco / Sacco Residence",
      "Sheriff's House Residence", "Toplin House", "Park Central", "Theresa Court", "Toplin 2",
      "Bellpark", "Reghkam", "South Point – Orchards", "Student Life – Northville", "Melade House",
      "Student Junction Residences (Goodman, Libertas, Le Ruth, Middestad, Picton)", "Elile House",
    ],
  },
  {
    label: "District Six (Cape Town) Campus",
    options: [
      "Cape Suites", "Catsville (Groote Schuur)", "City Edge Residence", "Downtown Lodge (Zonnebloem)",
      "Elizabeth Women's Residence (Gardens)", "J&B Residence (Zonnebloem)", "New Market Junction",
      "Plein Street (South Point)", "President House (South Point)", "Sandenburgh Residence (Zonnebloem)",
      "St Peters Residence – Block A", "Hanover Street Residence", "Vogue House", "Stanhope – South Point",
      "Harfield", "Rushkin House", "Mountain House",
    ],
  },
  {
    label: "Mowbray Campus",
    options: ["Viljoenhof Residence"],
  },
  {
    label: "Wellington Campus",
    options: ["House Bliss", "House Meiring", "Murray House", "House Navarre", "New Navarre", "Wouter Malan"],
  },
  {
    label: "Accredited Off-Campus (CPUT-approved)",
    options: ["Van Riebeck", "St Monica's", "Belle Cape", "Premier House", "Cape Station", "Imizamo", "F&S", "Khasia House", "Usenathi"],
  },
];

const money = (n) => "R" + (n % 1 === 0 ? n : n.toFixed(2));

const getPaymentReference = () => {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return user?.studentNumber || user?.idNumber;
  } catch {
    return undefined;
  }
};

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const fieldLabelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#334155" };
const fieldStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
};

function Checkout() {
  const navigate = useNavigate();
  const user = getLoggedInUser();

  const [cart, setCart] = useState({});
  const [catalog, setCatalog] = useState({});
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [delivery, setDelivery] = useState("courier");
  const [residence, setResidence] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [paxiPoint, setPaxiPoint] = useState("");
  const [payment, setPayment] = useState("YOCO");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
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

  // Fetch items catalog
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

  // Sync cart across tabs
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

  const items = Object.keys(cart)
    .filter((key) => cart[key] > 0 && catalog[key.split("::")[0]])
    .map((key) => {
      const [productId, size] = key.split("::");
      const p = catalog[productId];
      const qty = cart[key];
      return {
        id: key,
        qty,
        name: size ? `${p.name} (${size})` : p.name,
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

  const deliveryValid =
    (delivery === "courier" && residence !== "" && roomNumber.trim() !== "") ||
    (delivery === "paxi" && paxiPoint.trim() !== "");

  const deliveryHint =
    delivery === "courier"
      ? "Select your residence and enter your room number to continue."
      : "Enter your PAXI point name or code above to continue.";

  const getDeliverySummary = () => {
    if (delivery === "courier") return `Standard Delivery – ${residence}, room ${roomNumber.trim()}`;
    return `PAXI Pickup – ${paxiPoint.trim()}`;
  };

  const placeOrder = async () => {
    if (placingOrder) return;
    if (!deliveryValid) {
      setOrderError(deliveryHint);
      return;
    }
    setPlacingOrder(true);
    setOrderError(null);

    // Generate neat order reference
    const orderNum = `IH-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const results = await Promise.all(
        items.map((item) =>
          fetch(`${API_URL}/api/invoice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: crypto.randomUUID(),
              orderNumber: orderNum,
              receipt: {
                itemName: item.name,
                price: item.price,
                quantity: item.qty,
                subtotal: item.origLineTotal,
                serviceFee: 0,
                total: item.lineTotal,
                userId: user?.id,
                deliveryType: delivery,
                deliverySummary: getDeliverySummary(),
              },
            }),
          })
        )
      );

      if (results.some((res) => !res.ok)) {
        throw new Error("One or more invoices failed to save");
      }

      // Trigger confirmation email asynchronously
      if (user?.email) {
        fetch(`${API_URL}/api/auth/send-order-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            orderNumber: orderNum,
            totalAmount: money(total),
            deliveryDetails: getDeliverySummary(),
          }),
        }).catch((err) => console.error("Email trigger error:", err));
      }

      setConfirmation({
        orderNumber: orderNum,
        total,
        payment,
        deliverySummary: getDeliverySummary(),
      });
      saveCart({});
    } catch (err) {
      console.error("Failed to place order:", err);
      setOrderError("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const renderPayButton = () => {
    const blocked = placingOrder || !deliveryValid;

    if (payment === "YOCO") {
      return (
        <YocoPayment
          amount={total}
          paymentReference={getPaymentReference()}
          deliverySummary={getDeliverySummary()}
          disabled={blocked}
          buttonClassName="order-btn"
          onSuccess={placeOrder}
        />
      );
    }

    if (payment === "EFT") {
      return (
        <EFTPayment
          amount={total}
          bank={selectedBank}
          paymentReference={getPaymentReference()}
          disabled={blocked}
          loading={placingOrder}
          onSuccess={placeOrder}
        />
      );
    }

    return null;
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
          <div className="confirm-card" style={{ textAlign: "center", padding: "2rem", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div className="confirm-emoji" style={{ fontSize: "3rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "10px 0 4px" }}>Order Placed Successfully!</h2>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FF6B00", marginBottom: "16px" }}>
              Ref: #{confirmation.orderNumber}
            </div>

            <p style={{ color: "#475569", marginBottom: "12px" }}>
              A confirmation receipt has been sent to <strong>{user?.email || "your email"}</strong>.
            </p>

            <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", margin: "16px 0", textAlign: "left" }}>
              <div className="confirm-detail">Total: <strong>{money(confirmation.total)}</strong> via <span>{confirmation.payment}</span></div>
              <div className="confirm-detail" style={{ marginTop: "6px" }}>Fulfillment: <strong>{confirmation.deliverySummary}</strong></div>
            </div>

            {confirmation.payment === "EFT" && (
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "16px" }}>
                We'll confirm your payment once funds reflect in our account.
              </p>
            )}

            <button className="confirm-btn" style={{ width: "100%", padding: "12px", background: "#FF6B00", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
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
                <div className="del-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <div className={`del-opt ${delivery === "courier" ? "active" : ""}`} onClick={() => setDelivery("courier")}>
                    <div className="del-name">🚚 Standard Delivery</div>
                    <div className="del-desc">Direct to your residence</div>
                    <div className="del-price">FREE</div>
                  </div>
                  <div className={`del-opt ${delivery === "paxi" ? "active" : ""}`} onClick={() => setDelivery("paxi")}>
                    <div className="del-name">📦 PAXI Pickup</div>
                    <div className="del-desc">Collect at a PAXI point</div>
                    <div className="del-price">FREE</div>
                  </div>
                </div>

                {delivery === "courier" && (
                  <div style={{ marginTop: "14px" }}>
                    <label style={fieldLabelStyle} htmlFor="residence">Residence</label>
                    <select id="residence" value={residence} onChange={(e) => setResidence(e.target.value)} style={fieldStyle}>
                      <option value="">Select your residence</option>
                      {RESIDENCE_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((res) => (
                            <option key={res} value={res}>{res}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>

                    <label style={{ ...fieldLabelStyle, display: "block", marginTop: "12px" }} htmlFor="room">Room number</label>
                    <input id="room" type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. Room 214" style={fieldStyle} />
                  </div>
                )}

                {delivery === "paxi" && (
                  <div style={{ marginTop: "14px" }}>
                    <label style={fieldLabelStyle} htmlFor="paxi">PAXI Point Name or Code</label>
                    <input id="paxi" type="text" value={paxiPoint} onChange={(e) => setPaxiPoint(e.target.value)} placeholder="e.g. P8601 - PEP Cape Town Strand Street" style={fieldStyle} />
                    <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <a href="https://paxi.co.za/paxi-for-you" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "#FF6B00", fontWeight: 600 }}>
                        📍 Open PAXI Map Finder →
                      </a>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "6px" }}>
                      Find your nearest location on the PAXI map, then copy and paste the store name or P-Code above.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-head">Payment Method</div>
              <div className="card-body">
                <div className="pay-row">
                  {PAYMENT_METHODS.map((method) => (
                    <button key={method} className={`pay-opt ${payment === method ? "active" : ""}`} onClick={() => setPayment(method)}>
                      {method === "YOCO" ? "💳 Card (YOCO)" : "🏦 Bank (EFT)"}
                    </button>
                  ))}
                </div>

                {payment === "EFT" && (
                  <div style={{ marginTop: "12px" }}>
                    <label style={fieldLabelStyle} htmlFor="bank">Select Bank</label>
                    <select id="bank" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={fieldStyle}>
                      {BANKS.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                )}
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
                <div className="total-row discount">
                  <span>Student Discount <span className="disc-badge">-20%</span></span>
                  <span>-{money(discountAmount)}</span>
                </div>
                <div className="total-row final"><span>Total</span><span>{money(total)}</span></div>
              </div>
            </div>

            {orderError && <p style={{ color: "red", textAlign: "center" }}>{orderError}</p>}
            {!deliveryValid && <p style={{ color: "#64748B", textAlign: "center", fontSize: "0.85rem" }}>{deliveryHint}</p>}

            <div style={{ marginTop: "20px" }}>{renderPayButton()}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
