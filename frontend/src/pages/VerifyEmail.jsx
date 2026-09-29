import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/VerifyEmail.css";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify?token=${token}`)
      .then(async (res) => setMessage(await res.text()))
      .catch(() => setMessage("Something went wrong. Please try again."));
  }, []);

  return (
  <div className="verify-container">
    <h2 className="verify-message">{message}</h2>
  </div>
  );
}