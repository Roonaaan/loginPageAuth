import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) return navigate("/");

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      // Fallback: fetch from /me for email/password users
      apiRequest("/me", "GET").then(setUser).catch(() => navigate("/"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="card" style={{ alignItems: "center", gap: "12px" }}>
        {user.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "#3b82f6", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: "bold"
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <h2 style={{ margin: 0 }}>Welcome, {user.name}!</h2>
        <p style={{ margin: 0, color: "#94a3b8" }}>{user.email}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          🕐 Logged in at: {loginTime}
        </p>

        <button className="primary-btn" onClick={handleLogout} style={{ marginTop: 10 }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;