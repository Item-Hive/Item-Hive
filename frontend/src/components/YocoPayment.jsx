// 230036937 - Yoco Payment Integration - Orange and White
import { useState } from "react";

export default function YocoPayment({ amount, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      if (onSuccess) {
        onSuccess(amount);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
        <h3 style={{ color: "#FF6B00" }}>✓ Payment Successful!</h3>
        <p style={{ color: "#000", fontWeight: "bold" }}>Order Placed Successfully via YOCO</p>
        <p>Student: 230036937</p>
        <p style={{ fontWeight: "bold" }}>R{amount} charged</p>
        <p style={{ fontSize: "12px" }}>Test card: 4242 4242 4242 4242</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
      <h3 style={{ color: "#FF6B00" }}>Yoco Secure Payment - 230036937</h3>
      <p style={{ color: "#000" }}>Amount to pay: <strong>R{amount}</strong></p>
      <p style={{ fontSize: "12px", color: "#666" }}>Student: 230036937 | Test: 4242 4242 4242 4242</p>
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
          cursor: "pointer" 
        }}
      >
        {processing ? "Processing..." : `Pay R${amount} with Yoco`}
      </button>
    </div>
  );
}
