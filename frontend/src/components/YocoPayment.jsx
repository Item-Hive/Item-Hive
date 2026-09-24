import { useState } from "react";

function generateLuhnCard(prefix = "4", length = 16) {
  let digits = prefix;
  while (digits.length < length - 1) digits += Math.floor(Math.random() * 10);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = +digits[digits.length - 1 - i];
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  return digits + check;
}

function isValidLuhn(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = +digits[digits.length - 1 - i];
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

function formatCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export default function YocoPayment({
  amount,
  studentNumber,
  deliverySummary,
  onSuccess,
  disabled = false,
  buttonClassName = "order-btn",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        style={{ width: "100%" }}
      >
        Pay R{amount} with Yoco
      </button>

      {isOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <PaymentForm
              amount={amount}
              studentNumber={studentNumber}
              deliverySummary={deliverySummary}
              onPaid={() => setTimeout(() => { if (onSuccess) onSuccess(); }, 2500)}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  maxWidth: "420px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
};

function PaymentForm({ amount, studentNumber, deliverySummary, onPaid, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState("");

  const fillTestCard = () => {
    setCardNumber(formatCardNumber(generateLuhnCard()));
    setExpiry("12/29");
    setCvv("123");
    setCardError("");
  };

  const handlePay = () => {
    if (!isValidLuhn(cardNumber)) {
      setCardError("Enter a valid card number (or tap 'Use test card').");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setCardError("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setCardError("CVV must be 3–4 digits.");
      return;
    }

    setCardError("");
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

  const fieldStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "4px",
    borderRadius: "8px",
    border: "1px solid #CBD5E1",
    boxSizing: "border-box",
    fontSize: "0.95rem",
  };

  return (
    <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ color: "#FF6B00", marginBottom: "4px" }}>Yoco Secure Payment</h3>
      <p style={{ color: "#000", margin: "0 0 12px" }}>
        Amount to pay: <strong>R{amount}</strong>
      </p>

      <button
        type="button"
        onClick={fillTestCard}
        style={{
          background: "#F1F5F9",
          color: "#0F172A",
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "14px",
        }}
      >
        Use test card
      </button>

      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>Card number</label>
      <input
        type="text"
        placeholder="4242 4242 4242 4242"
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        style={fieldStyle}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>Expiry</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            style={fieldStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={fieldStyle}
          />
        </div>
      </div>

      {cardError && (
        <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "10px 0 0" }}>{cardError}</p>
      )}

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
          marginTop: "16px",
        }}
      >
        {processing ? "Processing..." : `Pay R${amount} with Yoco`}
      </button>
    </div>
  );
}
