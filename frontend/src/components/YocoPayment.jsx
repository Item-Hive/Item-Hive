import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function YocoPayment({
  amount,
  studentNumber,
  onSuccess,
  disabled = false,
  buttonClassName = "order-btn",
}) {
  const [popupWindow, setPopupWindow] = useState(null);
  const containerRef = useRef(document.createElement("div"));

  const openPopup = () => {
    const popup = window.open(
      "",
      "YocoPayment",
      "width=420,height=520,left=200,top=200"
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
      body { font-family: -apple-system, sans-serif; background: #F8FAFC; }
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

  useEffect(() => {
    return () => {
      if (popupWindow && !popupWindow.closed) popupWindow.close();
    };
  }, [popupWindow]);

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
            onSuccess={(amt) => {
              if (onSuccess) onSuccess(amt);
            }}
            onClose={() => popupWindow.close()}
          />,
          containerRef.current
        )}
    </>
  );
}

function PaymentForm({ amount, studentNumber, onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      if (onSuccess) onSuccess(amount);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px", textAlign: "center", margin: "16px" }}>
        <h3 style={{ color: "#FF6B00" }}>✓ Payment Successful!</h3>
        <p style={{ color: "#000", fontWeight: "bold" }}>Order Placed Successfully via YOCO</p>
        <p>Student: {studentNumber}</p>
        <p style={{ fontWeight: "bold" }}>R{amount} charged</p>
        <p style={{ fontSize: "12px" }}>Test card: 4242 4242 4242 4242</p>
        <button onClick={onClose} style={{ marginTop: "10px", padding: "8px 16px", background: "#0F172A", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px", margin: "16px" }}>
      <h3 style={{ color: "#FF6B00" }}>Yoco Secure Payment - {studentNumber}</h3>
      <p style={{ color: "#000" }}>Amount to pay: <strong>R{amount}</strong></p>
      <p style={{ fontSize: "12px", color: "#666" }}>Student: {studentNumber} | Test: 4242 4242 4242 4242</p>
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
