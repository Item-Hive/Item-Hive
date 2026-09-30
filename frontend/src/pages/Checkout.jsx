import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import YocoPayment from "../components/YocoPayment";
import EFTPayment from "../components/EFTPayment";
import emailjs from "@emailjs/browser";

const CART_KEY = "ict_branded_cart";
const USER_KEY = "ict_branded_user";
const DISCOUNT = 0.2;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";
const BANKS = ["FNB", "Standard Bank", "ABSA", "Nedbank", "Capitec"];
const PAYMENT_METHODS = ["YOCO", "EFT"];

// EmailJS (order confirmation emails)
const EMAILJS_SERVICE_ID = "service_yreimln";
const EMAILJS_TEMPLATE_ID = "template_x8vi8e9";
const EMAILJS_PUBLIC_KEY = "l4ZIEzZgbcdQwSqW6";

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

// Mock PAXI points database for fast, direct in-app searching
const SAMPLE_PAXI_POINTS = [
  { code: "P6268", name: "PEP CPT WOODSTOCK", address: "Shop 1 Crimson Square, Victoria Road, Woodstock, Western Cape, 7925" },
  { code: "P6414", name: "PEP CPT MAITLAND SQUARE", address: "Shop 5-6 Maitland Square, 278 Voortrekker Road, Maitland, Western Cape, 7405" },
  { code: "P4392", name: "PEPCELL GOLDEN ACRE", address: "Golden Acre Shopping Centre, Cape Town CBD, Western Cape, 8001" },
  { code: "P6355", name: "PEP HOUT BAY CENTRE", address: "Hout Bay Main Road, Hout Bay, Western Cape, 7806" },
  { code: "P5102", name: "PEP BELLVILLE MAIN ROAD", address: "122 Voortrekker Rd, Bellville, Cape Town, 7535" },
  { code: "P8601", name: "PEP CAPE TOWN STRAND STREET", address: "Strand St & Loop St, Cape Town City Centre, 8000" },
  { code: "P1290", name: "PEP STORE CLAREMONT", address: "Main Rd, Claremont, Cape Town, 7708" },
  { code: "P3310", name: "PEPCELL GOODWOOD", address: "Voortrekker Rd, Goodwood, Cape Town, 7460" },
];

const money = (n) => "R" + (n % 1 === 0 ? n : n.toFixed(2));

const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const getPaymentReference = () => {
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return u?.studentNumber || u?.idNumber;
  } catch {
    return undefined;
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

  // PAXI state
  const [paxiQuery, setPaxiQuery] = useState("");
  const [selectedPaxiPoint, setSelectedPaxiPoint] = useState(null);
  const [paxiDropdownOpen, setPaxiDropdownOpen] = useState(false);
  const [geoAddressResults, setGeoAddressResults] = useState([]);
  const [isSearchingGeo, setIsSearchingGeo] = useState(false);

  // PAXI Service Selection (Bag size & Delivery speed)
  const [paxiBagSize, setPaxiBagSize] = useState("standard"); // 'standard' (5kg) or 'large' (10kg)
  const [paxiSpeed, setPaxiSpeed] = useState("economy");      // 'economy' (7-9 days) or 'standard' (3-5 days)

  // Payment state
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

  // Live Geo-Address API lookup (Nominatim OpenStreetMap for SA addresses)
  useEffect(() => {
    if (!paxiQuery || paxiQuery.trim().length < 3) {
      setGeoAddressResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGeo(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            paxiQuery + ", South Africa"
          )}&limit=4`
        );
        if (response.ok) {
          const data = await response.json();
          setGeoAddressResults(data);
        }
      } catch (err) {
        console.error("Geo search failed:", err);
      } finally {
        setIsSearchingGeo(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [paxiQuery]);

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

  // PAXI Price calculation based on selections
  const getPaxiFee = () => {
    if (delivery !== "paxi") return 0;
    if (paxiBagSize === "standard" && paxiSpeed === "economy") return 59.95;
    if (paxiBagSize === "large" && paxiSpeed === "economy") return 109.95;
    if (paxiBagSize === "standard" && paxiSpeed === "standard") return 109.95;
    if (paxiBagSize === "large" && paxiSpeed === "standard") return 139.95;
    return 59.95;
  };

  const subtotal = items.reduce((s, i) => s + i.origLineTotal, 0);
  const discountAmount = Math.round(subtotal * DISCOUNT);
  const paxiFee = getPaxiFee();
  const total = subtotal - discountAmount + paxiFee;

  const deliveryValid =
    (delivery === "courier" && residence !== "" && roomNumber.trim() !== "") ||
    (delivery === "paxi" && (selectedPaxiPoint !== null || paxiQuery.trim().length > 3));

  const deliveryHint =
    delivery === "courier"
      ? "Select your residence and enter your room number to continue."
      : "Search and select a PAXI point above to continue.";

  const getDeliverySummary = () => {
    if (delivery === "courier") {
      return `Standard Delivery – ${residence}, room ${roomNumber.trim()}`;
    }
    const serviceLabel = `${paxiBagSize === "standard" ? "Standard Bag (5kg)" : "Large Bag (10kg)"} [${paxiSpeed === "economy" ? "7-9 Days" : "3-5 Days"}]`;
    if (selectedPaxiPoint) {
      return `PAXI Store-to-Store (${selectedPaxiPoint.code}) ${selectedPaxiPoint.name} - ${serviceLabel}`;
    }
    return `PAXI Store-to-Store – ${paxiQuery.trim()} - ${serviceLabel}`;
  };

  // Filter PAXI points locally based on search input
  const filteredPaxiPoints = SAMPLE_PAXI_POINTS.filter(
    (pt) =>
      pt.name.toLowerCase().includes(paxiQuery.toLowerCase()) ||
      pt.code.toLowerCase().includes(paxiQuery.toLowerCase()) ||
      pt.address.toLowerCase().includes(paxiQuery.toLowerCase())
  );

  const handleSelectPaxiPoint = (pt) => {
    setSelectedPaxiPoint(pt);
    setPaxiQuery(`(${pt.code}) ${pt.name}`);
    setPaxiDropdownOpen(false);
  };

  const handleSelectGeoAddress = (geoItem) => {
    setSelectedPaxiPoint({
      code: "GEO",
      name: geoItem.display_name.split(",")[0],
      address: geoItem.display_name,
    });
    setPaxiQuery(geoItem.display_name);
    setPaxiDropdownOpen(false);
  };

  const placeOrder = async () => {
    if (placingOrder) return;
    if (!deliveryValid) {
      setOrderError(deliveryHint);
      return;
    }
    setPlacingOrder(true);
    setOrderError(null);

    const orderNum = `IH-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliverySummary = getDeliverySummary();

    try {
      const results = await Promise.all(
        items.map((item, idx) => {
          const fee = idx === 0 ? paxiFee : 0; // delivery fee goes on the first invoice only
          return fetch(`${API_URL}/api/invoice`, {
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
                serviceFee: fee,
                total: item.lineTotal + fee,
                userId: user?.id,
                deliveryType: delivery,
                deliverySummary,
              },
            }),
          });
        })
      );

      if (results.some((r) => !r.ok)) throw new Error("One or more invoices failed to save");

      // Confirmation email (don't block the order if it fails)
      if (user?.email) {
        emailjs
          .send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_email: user.email,
              order_number: orderNum,
              total: money(total),
              delivery: deliverySummary,
            },
            { publicKey: EMAILJS_PUBLIC_KEY }
          )
          .catch((err) => console.error("EmailJS error:", err));
      }

      setConfirmation({ orderNumber: orderNum, total, payment, deliverySummary });
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
          <div style={{ textAlign: "center", padding: "2rem", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "3rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "10px 0 4px" }}>Order Placed Successfully!</h2>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FF6B00", marginBottom: "16px" }}>
              Ref: #{confirmation.orderNumber}
            </div>
            <p style={{ color: "#475569" }}>
              A confirmation receipt has been sent to <strong>{user?.email || "your email"}</strong>.
            </p>
            <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", margin: "16px 0", textAlign: "left" }}>
              <div>Total: <strong>{money(confirmation.total)}</strong> via <span>{confirmation.payment}</span></div>
              <div style={{ marginTop: "6px" }}>Fulfillment: <strong>{confirmation.deliverySummary}</strong></div>
            </div>
            {confirmation.payment === "EFT" && (
              <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
                We'll confirm your payment once funds reflect in our account.
              </p>
            )}
            <button
              style={{ width: "100%", padding: "12px", background: "#FF6B00", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
              onClick={() => navigate("/products")}
            >
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

            {/* Cart Summary */}
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

            {/* Delivery / Pickup Section */}
            <div className="card">
              <div className="card-head">Delivery / Pickup Option</div>
              <div className="card-body">
                <div className="del-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <div className={`del-opt ${delivery === "courier" ? "active" : ""}`} onClick={() => setDelivery("courier")}>
                    <div className="del-name">🚚 Residence Delivery</div>
                    <div className="del-desc">Direct to your residence</div>
                    <div className="del-price">FREE</div>
                  </div>
                  <div className={`del-opt ${delivery === "paxi" ? "active" : ""}`} onClick={() => setDelivery("paxi")}>
                    <div className="del-name">📦 PAXI Store-to-Store</div>
                    <div className="del-desc">Collect at PEP PAXI Point</div>
                    <div className="del-price">From {money(59.95)}</div>
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

                {/* PAXI Interactive Search & Geo Autocomplete */}
                {delivery === "paxi" && (
                  <div style={{ marginTop: "16px" }}>

                    {/* PAXI Store-to-Store Pricing Selector */}
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", marginBottom: "8px" }}>
                        1. Store-to-Store Delivery Service
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "12px" }}>
                        Drop off at a PAXI Point and collect at your nearest PAXI Point.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Bag Size:</label>
                          <select
                            value={paxiBagSize}
                            onChange={(e) => setPaxiBagSize(e.target.value)}
                            style={{ ...fieldStyle, marginTop: "4px", padding: "8px" }}
                          >
                            <option value="standard">Standard Bag (Max 5kg, 45x37 cm)</option>
                            <option value="large">Large Bag (Max 10kg, 64x51 cm)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.78rem", fontWeight: 600 }}>Delivery Speed:</label>
                          <select
                            value={paxiSpeed}
                            onChange={(e) => setPaxiSpeed(e.target.value)}
                            style={{ ...fieldStyle, marginTop: "4px", padding: "8px" }}
                          >
                            <option value="economy">Economy (7–9 Business Days)</option>
                            <option value="standard">Standard (3–5 Business Days)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFF7ED", border: "1px solid #FFEDD5", padding: "8px 12px", borderRadius: "6px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#C2410C", fontWeight: 600 }}>Calculated PAXI Fee:</span>
                        <span style={{ fontSize: "1rem", color: "#F97316", fontWeight: 700 }}>{money(paxiFee)}</span>
                      </div>
                    </div>

                    {/* PAXI Store/Address Search */}
                    <div style={{ position: "relative" }}>
                      <label style={fieldLabelStyle} htmlFor="paxi-search">2. Search PAXI Location or Street Address</label>
                      <input
                        id="paxi-search"
                        type="text"
                        value={paxiQuery}
                        onChange={(e) => {
                          setPaxiQuery(e.target.value);
                          setSelectedPaxiPoint(null);
                          setPaxiDropdownOpen(true);
                        }}
                        onFocus={() => setPaxiDropdownOpen(true)}
                        placeholder="Type suburb, street address, PEP store or P-Code..."
                        style={fieldStyle}
                      />

                      {/* Autocomplete Dropdown List */}
                      {paxiDropdownOpen && paxiQuery.trim().length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "#FFF",
                            border: "1px solid #CBD5E1",
                            borderRadius: "8px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            maxHeight: "240px",
                            overflowY: "auto",
                            zIndex: 20,
                            marginTop: "4px",
                          }}
                        >
                          {/* Saved PEP Locations */}
                          {filteredPaxiPoints.map((pt) => (
                            <div
                              key={pt.code}
                              onClick={() => handleSelectPaxiPoint(pt)}
                              style={{ padding: "10px 12px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", textAlign: "left" }}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <div style={{ fontWeight: 600, color: "#FF6B00", fontSize: "0.88rem" }}>
                                🏬 ({pt.code}) {pt.name}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "2px" }}>
                                {pt.address}
                              </div>
                            </div>
                          ))}

                          {/* Live Geo Autocomplete Results */}
                          {geoAddressResults.length > 0 && (
                            <div style={{ borderTop: "2px solid #E2E8F0" }}>
                              <div style={{ padding: "6px 12px", fontSize: "0.72rem", color: "#94A3B8", fontWeight: 700, background: "#F8FAFC" }}>
                                📍 SUGGESTED ADDRESSES (GEO LOOKUP)
                              </div>
                              {geoAddressResults.map((geo, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => handleSelectGeoAddress(geo)}
                                  style={{ padding: "10px 12px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", textAlign: "left" }}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <div style={{ fontWeight: 600, color: "#334155", fontSize: "0.85rem" }}>
                                    📍 {geo.display_name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {isSearchingGeo && (
                            <div style={{ padding: "10px", fontSize: "0.8rem", color: "#64748B", textAlign: "center" }}>
                              Searching addresses...
                            </div>
                          )}
                        </div>
                      )}

                      {selectedPaxiPoint && (
                        <div style={{ marginTop: "10px", padding: "10px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "6px", fontSize: "0.85rem", color: "#166534" }}>
                          <strong>Selected Drop/Collection Point:</strong> {selectedPaxiPoint.name}
                          <br />
                          <span style={{ fontSize: "0.78rem", color: "#15803D" }}>{selectedPaxiPoint.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
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

            {/* Price Breakdown */}
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
                {delivery === "paxi" && (
                  <div className="total-row">
                    <span>PAXI Delivery Fee ({paxiBagSize}, {paxiSpeed})</span>
                    <span>{money(paxiFee)}</span>
                  </div>
                )}
                <div className="total-row final"><span>Total</span><span>{money(total)}</span></div>
              </div>
            </div>

            {orderError && <p style={{ color: "red", textAlign: "center", marginTop: "12px" }}>{orderError}</p>}
            {!deliveryValid && <p style={{ color: "#64748B", textAlign: "center", fontSize: "0.85rem", marginTop: "12px" }}>{deliveryHint}</p>}

            <div style={{ marginTop: "20px" }}>{renderPayButton()}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;