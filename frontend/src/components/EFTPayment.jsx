import { useState } from "react";

const BANK_DETAILS = {
  "FNB": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "62891234567", branchCode: "250655" },
  "Standard Bank": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "01123456789", branchCode: "051001" },
  "ABSA": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "40987654321", branchCode: "632005" },
  "Nedbank": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "11223344556", branchCode: "198765" },
  "Capitec": { accountHolder: "ItemHive (Pty) Ltd", accountNumber: "1503456789", branchCode: "470010" },
};

export default function EFTPayment({ amount, bank, paymentReference, onSuccess, disabled = false }) {
  const d = BANK_DETAILS[bank];
  const reference =  paymentReference|| "Your reference";

  return (
    <div style={{ background: "#FFFFFF", border: "2px solid #FF6B00", padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ color: "#FF6B00" }}>EFT Payment – {bank}</h3>
      <p>Amount to pay: <strong>R{amount}</strong></p>
      <p style={{ fontSize: "13px", color: "#444" }}>
        Account holder: {d.accountHolder}<br />
        Account number: {d.accountNumber}<br />
        Branch code: {d.branchCode}<br />
        Reference: <strong>{reference}</strong>
      </p>
      <button
        onClick={onSuccess}
        disabled={disabled}
        style={{ background: "#FF6B00", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", fontWeight: "bold", width: "100%", cursor: "pointer" }}
      >
        I've made the payment
      </button>
    </div>
  );
}