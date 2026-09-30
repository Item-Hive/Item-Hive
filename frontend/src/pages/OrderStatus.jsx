import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/OrderStatus.css";

function OrderStatus() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("pending_stripe_order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <div className="order-status-container">
      <div className="status-card">
        <div className="status-card-head">
          <span>Active Order Tracker</span>
          <span className="status-badge">Paid & Processing</span>
        </div>

        {order ? (
          <div className="status-card-body">
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
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="status-item-price">
                    R{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="status-info-row" style={{ paddingTop: "12px", borderTop: "1px dashed var(--border-slate)" }}>
              <span className="status-label">Total Amount Paid</span>
              <span className="status-value" style={{ fontSize: "1.1rem" }}>
                R{order.total?.toFixed(2)}
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