import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const phone = decodeURIComponent(new URLSearchParams(window.location.search).get("phone"));

  const handleSubmit = async () => {
    if (code.length !== 6) return alert("Please enter the 6-digit code");
    setLoading(true);
    try {
      const data = await apiRequest("/verify-code", "POST", { phone, code });
      navigate(`/reset-password?token=${data.token}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Enter Code 🔐</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "10px" }}>
          Enter the 6-digit code sent to <strong>{phone}</strong>
        </p>
        <input
          type="text"
          placeholder="6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          style={{ letterSpacing: "8px", fontSize: "1.2rem", textAlign: "center" }}
        />
        <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Verifying..." : "Verify Code"}
        </button>
        <div className="link" onClick={() => navigate("/forgot-password")}>
          Resend Code
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;