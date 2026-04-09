import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OAuthButtons from "../components/OAuthButtons";
import { apiRequest } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = await apiRequest("/login", "POST", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="container">
      <div className="card">
        <h2>Signin Page</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <button className="primary-btn" onClick={handleSubmit}>
          Login
        </button>

        <div className="link" onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </div>

        <div className="divider">or</div>

        <OAuthButtons />

        <div className="link" onClick={() => navigate("/signup")}>
          Don't have an account? Sign up
        </div>
      </div>
    </div>
  );
};

export default Signin;