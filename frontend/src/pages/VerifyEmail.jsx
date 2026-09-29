import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/VerifyEmail.css";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const text = await res.text();
        setMessage(text);
        if (res.ok) setIsSuccess(true);
      })
      .catch(() => setMessage("Something went wrong. Please try again."));
  }, [params]);

  return (
    <div className="verify-container">
      <h2 className="verify-message">{message}</h2>
      {isSuccess && (
        <Link to="/login" className="verify-login-btn">
          Proceed to Sign In
        </Link>
      )}
    </div>
  );
}