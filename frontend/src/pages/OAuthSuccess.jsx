import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token) {
      localStorage.setItem("token", token);
      if (user) {
        try {
          // Parse and re-stringify to ensure clean JSON in localStorage
          const parsed = JSON.parse(decodeURIComponent(user));
          localStorage.setItem("user", JSON.stringify(parsed));
        } catch {
          localStorage.setItem("user", user);
        }
      }
      navigate("/dashboard");
    }
  }, []);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;