import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone) return alert("Please enter your phone number");
    setLoading(true);
    try {
      await apiRequest("/forgot-password", "POST", { phone });
      setSent(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div className="container">
      <div className="card">
        <h2>Check Your Phone 📱</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "20px" }}>
          A 6-digit code was sent to <strong>{phone}</strong>.
          It expires in <strong>5 minutes</strong>.
        </p>
        <button className="primary-btn" onClick={() => navigate(`/verify-code?phone=${encodeURIComponent(phone)}`)}>
          Enter Code
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "10px" }}>
          Enter your phone number and we'll send you a reset code.
        </p>
        <input
          type="tel"
          placeholder="Phone (e.g. +639123456789)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
        <div className="link" onClick={() => navigate("/")}>
          Back to Login
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;