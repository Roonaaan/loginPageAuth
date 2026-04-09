import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const rules = [
  { label: "Must be at least 8 characters", test: (p) => p.length >= 8 },
  { label: "Must include an uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Must include a lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Must include a number", test: (p) => /[0-9]/.test(p) },
  { label: "Must include a special character", test: (p) => /[!@#$%^&*]/.test(p) },
  { label: "Cannot contain repeating characters (e.g. aaa)", test: (p) => !/(.)\1{2,}/.test(p) },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  const allPassed = rules.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async () => {
    if (!allPassed) return alert("Fix password requirements first");
    if (!passwordsMatch) return alert("Passwords do not match");
    if (!token) return alert("Invalid or missing token");

    setLoading(true);
    try {
      await apiRequest("/reset-password", "POST", { token, password });
      setSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        {success ? (
          <>
            <h2>Password Reset! ✅</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "20px" }}>
              Your password has been successfully updated.
            </p>
            <button className="primary-btn" onClick={() => navigate("/")}>
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setTouched(true); }}
              style={{ marginTop: "10px" }}
            />

            {touched && (
              <ul className="password-rules">
                {rules.map((rule, i) => {
                  const passed = rule.test(password);
                  return (
                    <li key={i} className={passed ? "rule-pass" : "rule-fail"}>
                      <FontAwesomeIcon icon={passed ? faCheck : faXmark} />
                      {" "}{rule.label}
                    </li>
                  );
                })}
              </ul>
            )}

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ marginTop: "10px" }}
            />

            {confirmPassword.length > 0 && (
              <p className={passwordsMatch ? "rule-pass" : "rule-fail"}
                style={{ fontSize: "0.82rem", textAlign: "left", marginTop: "6px" }}
              >
                <FontAwesomeIcon icon={passwordsMatch ? faCheck : faXmark} />
                {" "}{passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            <button
              className="primary-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;