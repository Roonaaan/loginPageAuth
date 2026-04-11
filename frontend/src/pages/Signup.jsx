import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const Signup = () => {
  const navigate = useNavigate();
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "+63" });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") setTouched(true);
  };

  const allPassed = rules.every((r) => r.test(form.password));
  const passwordsMatch = form.password === confirmPassword;

  const handleSubmit = async () => {
    if (!allPassed) return toast.error("Fix password requirements first");
    if (!passwordsMatch) return toast.error("Passwords do not match");

    try {
      await apiRequest("/register", "POST", form);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (e.g. +639123456789)"
          value={form.phone}
          onChange={(e) => {
            // Prevent removing the +63 prefix
            const val = e.target.value;
            if (!val.startsWith("+63 ")) return;
            setForm({ ...form, phone: val });
          }}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ marginTop: "10px" }}
        />

        {touched && (
          <ul className="password-rules">
            {rules.map((rule, i) => {
              const passed = rule.test(form.password);
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginTop: "10px" }}
        />

        {confirmPassword.length > 0 && (
          <p
            className={passwordsMatch ? "rule-pass" : "rule-fail"}
            style={{ fontSize: "0.82rem", textAlign: "left", marginTop: "6px" }}
          >
            <FontAwesomeIcon icon={passwordsMatch ? faCheck : faXmark} />
            {" "}{passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

        <button className="primary-btn" onClick={handleSubmit}>
          Create Account
        </button>

        <div className="link" onClick={() => navigate("/")}>
          Already have an account? Login
        </div>
      </div>
    </div>
  );
};

export default Signup;