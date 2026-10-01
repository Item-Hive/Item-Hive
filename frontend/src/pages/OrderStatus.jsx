import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OrderStatus.css";

const LAST_ORDER_KEY = "ict_branded_last_order";
const money = (n) => "R" + Number(n || 0).toFixed(2);

function OrderStatus() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_ORDER_KEY);
      if (saved) setOrder(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load last order", e);
    }
  }, []);

  const isEft = order?.payment === "EFT";

  return (
    <div className="order-status-container">
      <div className="status-card">
        <div className="status-card-head">
          <span>Active Order Tracker</span>
          {order && (
            <span className="status-badge">
              {isEft ? "Awaiting payment" : "Paid & Processing"}
            </span>
          )}
        </div>

        {order ? (
          <div className="status-card-body">
            <div className="status-info-row">
              <span className="status-label">Order Number</span>
              <span className="status-value">#{order.orderNumber}</span>
            </div>

            <div className="status-info-row">
              <span className="status-label">Delivery Location</span>
              <span className="status-value">{order.deliverySummary}</span>
            </div>

            <div style={{ marginTop: "8px" }}>
              <div className="status-label" style={{ marginBottom: "8px" }}>
                Items Ordered
              </div>
              {order.items?.map((item, idx) => (
                <div key={idx} className="status-item">
                  <span className="status-item-name">
                    {item.name} (x{item.qty})
                  </span>
                  <span className="status-item-price">{money(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {order.paxiFee > 0 && (
              <div className="status-info-row" style={{ paddingTop: "12px" }}>
                <span className="status-label">PAXI Delivery Fee</span>
                <span className="status-value">{money(order.paxiFee)}</span>
              </div>
            )}

            <div
              className="status-info-row"
              style={{ paddingTop: "12px", borderTop: "1px dashed var(--border-slate)" }}
            >
              <span className="status-label">
                {isEft ? "Total Due (EFT)" : "Total Amount Paid"}
              </span>
              <span className="status-value" style={{ fontSize: "1.1rem" }}>
                {money(order.total)}
              </span>
            </div>
          </div>
        ) : (
          <div className="status-card-body" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p className="status-label">No recent order details found.</p>
          </div>
        )}
      </div>

      <Link to="/" className="status-action-btn">
        Return to Store
      </Link>
    </div>
  );
}

export default OrderStatus;