import { useEffect, useState } from "react";

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

function formatExpiry(value) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

const fmt = (n) => {
  const num = Number(n);
  return "R" + (Number.isInteger(num) ? num : num.toFixed(2));
};

const STYLES = `
.ihp-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);animation:ihp-fade .18s ease-out}
.ihp-modal{position:relative;width:100%;max-width:420px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(15,23,42,.35);animation:ihp-rise .22s ease-out}
.ihp-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 0}
.ihp-secure{display:flex;align-items:center;gap:6px;font-size:.82rem;font-weight:600;color:#475569}
.ihp-close{border:0;background:#F1F5F9;color:#475569;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1.1rem;line-height:1}
.ihp-close:hover{background:#E2E8F0}
.ihp-amount{padding:8px 20px 0;font-size:2rem;font-weight:800;color:#0F172A;letter-spacing:-.02em}
.ihp-amount small{display:block;font-size:.8rem;font-weight:500;color:#64748B;letter-spacing:0}
.ihp-body{padding:16px 20px 20px}
.ihp-card{position:relative;aspect-ratio:1.75/1;border-radius:16px;padding:16px 18px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;background:radial-gradient(circle at 100% 0%,rgba(255,107,0,.45),transparent 55%),linear-gradient(135deg,#0F172A,#1E293B 70%);box-shadow:0 10px 24px rgba(15,23,42,.25)}
.ihp-card-top{display:flex;align-items:center;justify-content:space-between}
.ihp-logo{font-weight:800;font-size:1.05rem}
.ihp-logo span{color:#FF6B00}
.ihp-chip{width:34px;height:26px;border-radius:6px;background:linear-gradient(135deg,#FDE7B0,#E2B25B)}
.ihp-card-number{font-size:1.2rem;font-weight:600;letter-spacing:.12em;font-variant-numeric:tabular-nums;white-space:nowrap}
.ihp-card-bottom{display:flex;align-items:flex-end;justify-content:space-between}
.ihp-card-label{display:block;font-size:.65rem;color:rgba(255,255,255,.6)}
.ihp-card-val{font-size:.9rem;font-weight:600;font-variant-numeric:tabular-nums}
.ihp-network{font-size:.8rem;font-weight:800;letter-spacing:.06em;color:rgba(255,255,255,.85)}
.ihp-field{margin-top:14px}
.ihp-label{display:block;font-size:.8rem;font-weight:600;color:#334155;margin-bottom:6px}
.ihp-input{width:100%;box-sizing:border-box;height:46px;padding:0 14px;border:1px solid #CBD5E1;border-radius:12px;font-size:1rem;color:#0F172A;background:#fff;font-variant-numeric:tabular-nums;transition:border-color .15s,box-shadow .15s}
.ihp-input::placeholder{color:#94A3B8}
.ihp-input:focus{outline:none;border-color:#FF6B00;box-shadow:0 0 0 3px rgba(255,107,0,.18)}
.ihp-row{display:flex;gap:12px}
.ihp-row>div{flex:1}
.ihp-test{margin-top:14px;background:none;border:0;padding:0;color:#FF6B00;font-weight:600;font-size:.85rem;cursor:pointer}
.ihp-test:hover{text-decoration:underline}
.ihp-error{margin:12px 0 0;color:#DC2626;font-size:.85rem}
.ihp-pay{margin-top:18px;width:100%;height:50px;border:0;border-radius:12px;background:#FF6B00;color:#fff;font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s}
.ihp-pay:hover:not(:disabled){background:#E85F00}
.ihp-pay:focus-visible{outline:3px solid rgba(255,107,0,.4);outline-offset:2px}
.ihp-pay:disabled{background:#FDBA8C;cursor:not-allowed}
.ihp-note{margin:12px 0 0;text-align:center;font-size:.75rem;color:#94A3B8}
.ihp-spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:ihp-spin .7s linear infinite}
.ihp-spin-dark{border-color:rgba(100,116,139,.3);border-top-color:#64748B}
.ihp-success{padding:32px 24px 24px;text-align:center}
.ihp-check{width:64px;height:64px;margin:0 auto 14px;display:block}
.ihp-check circle{fill:#FFF1E6}
.ihp-check path{fill:none;stroke:#FF6B00;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;animation:ihp-draw .5s .15s ease-out forwards}
.ihp-success h3{margin:0 0 6px;font-size:1.3rem;font-weight:800;color:#0F172A}
.ihp-success p{margin:4px 0;color:#64748B;font-size:.9rem}
.ihp-success strong{color:#0F172A}
.ihp-finalising{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;font-size:.8rem;color:#94A3B8}
.ihp-link{margin-top:14px;background:none;border:0;color:#64748B;font-size:.8rem;cursor:pointer;text-decoration:underline}
@keyframes ihp-fade{from{opacity:0}to{opacity:1}}
@keyframes ihp-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ihp-spin{to{transform:rotate(360deg)}}
@keyframes ihp-draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.ihp-overlay,.ihp-modal{animation:none}.ihp-check path{animation:none;stroke-dashoffset:0}.ihp-spin{animation-duration:1.6s}}
`;

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export default function YocoPayment({
  amount,
  deliverySummary,
  onSuccess,
  disabled = false,
  buttonClassName = "order-btn",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{STYLES}</style>
      <button
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        style={{ width: "100%" }}
      >
        Pay {fmt(amount)} with Yoco
      </button>

      {isOpen && (
        <PaymentForm
          amount={amount}
          deliverySummary={deliverySummary}
          onPaid={() => setTimeout(() => { if (onSuccess) onSuccess(); }, 2500)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function PaymentForm({ amount, deliverySummary, onPaid, onClose }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !processing) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [processing, onClose]);

  const digits = cardNumber.replace(/\D/g, "");
  const previewNumber = digits.padEnd(16, "•").replace(/(.{4})(?=.)/g, "$1 ");
  const brand = digits.startsWith("4")
    ? "VISA"
    : /^(5[1-5]|2[2-7])/.test(digits)
    ? "MASTERCARD"
    : "";

  const fillTestCard = () => {
    setCardNumber(formatCardNumber(generateLuhnCard()));
    setExpiry("12/29");
    setCvv("123");
    setCardError("");
  };

  const handlePay = () => {
    if (processing) return;
    if (!isValidLuhn(cardNumber)) {
      setCardError("Enter a valid card number, or use the test card.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setCardError("Expiry must be a valid date in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setCardError("CVV must be 3 or 4 digits.");
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

  return (
    <div
      className="ihp-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !processing) onClose();
      }}
    >
      <div className="ihp-modal" role="dialog" aria-modal="true" aria-label="Card payment">
        {success ? (
          <div className="ihp-success">
            <svg className="ihp-check" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" />
              <path d="M20 33l8 8 16-17" />
            </svg>
            <h3>Payment received</h3>
            <p>You paid <strong>{fmt(amount)}</strong> by card.</p>
            {deliverySummary && <p>{deliverySummary}</p>}
            <div className="ihp-finalising">
              <span className="ihp-spin ihp-spin-dark" />
              Finalising your order…
            </div>
            <button type="button" className="ihp-link" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="ihp-head">
              <span className="ihp-secure"><LockIcon /> Yoco secure payment</span>
              <button type="button" className="ihp-close" onClick={onClose} aria-label="Close">×</button>
            </div>
            <div className="ihp-amount">
              <small>Amount due</small>
              {fmt(amount)}
            </div>

            <form
              className="ihp-body"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handlePay();
              }}
            >
              <div className="ihp-card" aria-hidden="true">
                <div className="ihp-card-top">
                  <span className="ihp-logo">Item<span>Hive</span></span>
                  <span className="ihp-chip" />
                </div>
                <div className="ihp-card-number">{previewNumber}</div>
                <div className="ihp-card-bottom">
                  <div>
                    <span className="ihp-card-label">Expires</span>
                    <span className="ihp-card-val">{expiry || "MM/YY"}</span>
                  </div>
                  <span className="ihp-network">{brand}</span>
                </div>
              </div>

              <div className="ihp-field">
                <label className="ihp-label" htmlFor="ihp-number">Card number</label>
                <input
                  id="ihp-number"
                  className="ihp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>

              <div className="ihp-field ihp-row">
                <div>
                  <label className="ihp-label" htmlFor="ihp-expiry">Expiry</label>
                  <input
                    id="ihp-expiry"
                    className="ihp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div>
                  <label className="ihp-label" htmlFor="ihp-cvv">CVV</label>
                  <input
                    id="ihp-cvv"
                    className="ihp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </div>
              </div>

              <button type="button" className="ihp-test" onClick={fillTestCard}>
                Fill in test card details
              </button>

              {cardError && <p className="ihp-error" role="alert">{cardError}</p>}

              <button type="submit" className="ihp-pay" disabled={processing}>
                {processing ? (
                  <>
                    <span className="ihp-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${fmt(amount)}`
                )}
              </button>

              <p className="ihp-note">Demo payment. No real money is charged.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}