import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function YocoPayment({
  amount,
  studentNumber,
  deliverySummary,
  onSuccess,
  disabled = false,
  buttonClassName = "order-btn",
}) {
  const [popupWindow, setPopupWindow] = useState(null);
  const containerRef = useRef(document.createElement("div"));
  const successTimer = useRef(null);

  const openPopup = () => {
    const popup = window.open(
      "",
      "YocoPayment",
      "width=420,height=560,left=200,top=200"
    );

    if (!popup) {
      alert("Please allow popups for this site to complete payment.");
      return;
    }

    popup.document.title = "Yoco Secure Payment";
    popup.document.body.style.margin = "0";
    popup.document.body.appendChild(containerRef.current);

    // Basic styling inside the popup document
    const style = popup.document.createElement("style");
    style.textContent = `
      body { font-family: -apple-system, "Segoe UI", sans-serif; background: #F8FAFC; }
    `;
    popup.document.head.appendChild(style);

    setPopupWindow(popup);

    // Close cleanly if the user closes the popup manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        setPopupWindow(null);
        clearInterval(checkClosed);
      }
    }, 500);
  };

  // Close the popup if this component goes away
  useEffect(() => {
    return () => {
      if (popupWindow && !popupWindow.closed) popupWindow.close();
    };
  }, [popupWindow]);

  // Clear the pending "place order" timer if the component goes away
  useEffect(() => {
    return () => clearTimeout(successTimer.current);
  }, []);

  // Payment went through: let the popup show the confirmation card for a moment,
  // then place the order (which closes the popup and shows the page confirmation)
  const handlePaid = () => {
    successTimer.current = setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 2500);
  };

  return (
    <>
      {/* Uses the same class as the SnapScan/EFT button so they match */}
      <button
        className={buttonClassName}
        onClick={openPopup}
        disabled={disabled}
        style={{ width: "100%" }}
      >
        Pay R{amount} with Yoco
      </button>

      {popupWindow &&
        createPortal(
          <PaymentForm
            amount={amount}
            studentNumber={studentNumber}
            deliverySummary={deliverySummary}
            onPaid={handlePaid}
            onClose={() => popupWindow.close()}
          />,
          containerRef.current
        )}
    </>
  );
}

function PaymentForm({ amount, studentNumber, deliverySummary, onPaid, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      if (onPaid) onPaid();
    }, 1500);
  };

  if (success) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          padding: "32px 20px",
          borderRadius: "20px",
          textAlign: "center",
          margin: "16px",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🎉</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", margin: "10px 0" }}>
          Order Placed Successfully!
        </div>
        <div style={{ color: "#64748B", marginBottom: "10px" }}>
          Total charged: <strong style={{ color: "#FF6B00" }}>R{amount}</strong> via{" "}
          <strong style={{ color: "#0F172A" }}>YOCO</strong>
        </div>
        {deliverySummary && (
          <div style={{ color: "#64748B", marginBottom: "10px" }}>
            Delivery: <strong style={{ color: "#FF6B00" }}>{deliverySummary}</strong>
          </div>
        )}
        <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "16px" }}>
          Returning you to the shop...
        </div>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: "#FF6B00",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px", margin: "16px" }}>
      <h3 style={{ color: "#FF6B00" }}>Yoco Secure Payment</h3>
      <p style={{ color: "#000" }}>Amount to pay: <strong>R{amount}</strong></p>
      <p style={{ fontSize: "12px", color: "#666" }}>Test card: 4242 4242 4242 4242</p>
      <button
        onClick={handlePay}
        disabled={processing}
        style={{
          background: "#FF6B00",
          color: "#FFFFFF",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {processing ? "Processing..." : `Pay R${amount} with Yoco`}
      </button>
    </div>
  );
}
