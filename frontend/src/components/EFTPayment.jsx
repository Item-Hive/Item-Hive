import { useState } from "react";

const BANK_DETAILS = {
  "FNB": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "62891234567", branchCode: "250655" },
  "Standard Bank": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "01123456789", branchCode: "051001" },
  "ABSA": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "40987654321", branchCode: "632005" },
  "Nedbank": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "11223344556", branchCode: "198765" },
  "Capitec": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "1503456789", branchCode: "470010" },
};

const fmt = (n) => {
  const num = Number(n);
  return "R" + (Number.isInteger(num) ? num : num.toFixed(2));
};

const STYLES = `
.ihe-wrap{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:22px;box-shadow:0 8px 24px rgba(15,23,42,.06)}
.ihe-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ihe-kicker{font-size:.82rem;font-weight:600;color:#64748B}
.ihe-amount{margin-top:2px;font-size:2rem;font-weight:800;letter-spacing:-.02em;color:#0F172A}
.ihe-bank{padding:6px 12px;border-radius:999px;background:#0F172A;color:#fff;font-size:.8rem;font-weight:700;white-space:nowrap}
.ihe-list{margin:18px 0 0;padding:0;list-style:none;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden}
.ihe-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;background:#fff}
.ihe-row+.ihe-row{border-top:1px solid #F1F5F9}
.ihe-label{display:block;font-size:.75rem;color:#64748B}
.ihe-value{display:block;margin-top:2px;font-size:.95rem;font-weight:600;color:#0F172A;font-variant-numeric:tabular-nums;word-break:break-all}
.ihe-ref{background:#FFF4EB;border-top:1px solid #FFD9BD !important}
.ihe-ref .ihe-value{color:#C2410C}
.ihe-copy{flex-shrink:0;border:1px solid #CBD5E1;background:#fff;color:#334155;border-radius:8px;padding:6px 10px;font-size:.78rem;font-weight:600;cursor:pointer;transition:background .15s,border-color .15s}
.ihe-copy:hover{background:#F8FAFC;border-color:#94A3B8}
.ihe-copy.done{background:#ECFDF5;border-color:#6EE7B7;color:#047857}
.ihe-hint{margin:10px 2px 0;font-size:.78rem;color:#64748B}
.ihe-btn{margin-top:18px;width:100%;height:50px;border:0;border-radius:12px;background:#FF6B00;color:#fff;font-size:1rem;font-weight:700;cursor:pointer;transition:background .15s}
.ihe-btn:hover:not(:disabled){background:#E85F00}
.ihe-btn:focus-visible{outline:3px solid rgba(255,107,0,.4);outline-offset:2px}
.ihe-btn:disabled{background:#FDBA8C;cursor:not-allowed}
.ihe-note{margin:12px 0 0;text-align:center;font-size:.75rem;color:#94A3B8}
`;

export default function EFTPayment({ amount, bank, paymentReference, onSuccess, disabled = false, loading = false }) {
  const d = BANK_DETAILS[bank];
  const reference = paymentReference || "Your reference";
  const [copied, setCopied] = useState("");

  if (!d) return null;

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard not available, ignore */
    }
  };

  const rows = [
    { key: "holder", label: "Account holder", value: d.accountHolder },
    { key: "acc", label: "Account number", value: d.accountNumber },
    { key: "branch", label: "Branch code", value: d.branchCode },
    { key: "ref", label: "Payment reference", value: reference, highlight: true },
  ];

  return (
    <div className="ihe-wrap">
      <style>{STYLES}</style>

      <div className="ihe-top">
        <div>
          <div className="ihe-kicker">Pay by EFT</div>
          <div className="ihe-amount">{fmt(amount)}</div>
        </div>
        <span className="ihe-bank">{bank}</span>
      </div>

      <ul className="ihe-list">
        {rows.map((r) => (
          <li key={r.key} className={`ihe-row ${r.highlight ? "ihe-ref" : ""}`}>
            <div>
              <span className="ihe-label">{r.label}</span>
              <span className="ihe-value">{r.value}</span>
            </div>
            <button
              type="button"
              className={`ihe-copy ${copied === r.key ? "done" : ""}`}
              onClick={() => copy(r.key, r.value)}
            >
              {copied === r.key ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ul>
      <p className="ihe-hint">Use the exact reference above so we can match your payment to your order.</p>

      <button className="ihe-btn" onClick={onSuccess} disabled={disabled || loading}>
        {loading ? "Placing your order…" : "I've made the payment"}
      </button>
      <p className="ihe-note">Demo bank details. No real transfer is made.</p>
    </div>
  );
}