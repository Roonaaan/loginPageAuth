import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiRequest } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faPen, faUpload } from "@fortawesome/free-solid-svg-icons";

const passwordRules = [
  { label: "Must be at least 8 characters", test: (p) => p.length >= 8 },
  { label: "Must include an uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Must include a lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Must include a number", test: (p) => /[0-9]/.test(p) },
  { label: "Must include a special character", test: (p) => /[!@#$%^&*]/.test(p) },
  { label: "Cannot contain repeating characters", test: (p) => !/(.)\1{2,}/.test(p) },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginTime] = useState(new Date().toLocaleString());
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    picture: "",
  });

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setProfileForm({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "+63",
        picture: parsed.picture || "",
      });
    } else {
      apiRequest("/me", "GET").then((u) => {
        setUser(u);
        setProfileForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "+63",
          picture: u.picture || "",
        });
      }).catch(() => navigate("/"));
    }
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logging out?",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#ffffff",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const handleProfileSave = async () => {
    try {
      const updated = await apiRequest("/profile", "PUT", profileForm);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Profile updated!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const allPassed = passwordRules.every((r) => r.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword;

  const handlePasswordSave = async () => {
    if (!allPassed) return toast.error("Fix password requirements first");
    if (!passwordsMatch) return toast.error("Passwords do not match");
    try {
      await apiRequest("/password", "PUT", { password: newPassword });
      toast.success("Password updated!");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordTouched(false);
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm({ ...profileForm, picture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const openModal = () => {
    setActiveTab("profile");
    setShowModal(true);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="card" style={{ alignItems: "center", gap: "12px" }}>

        {/* Profile Picture */}
        <div style={{ position: "relative" }}>
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
              fontSize: 32, fontWeight: "bold",
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div
            onClick={openModal}
            style={{
              position: "absolute", bottom: 0, right: 0,
              background: "#3b82f6", borderRadius: "50%",
              width: 24, height: 24, display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 11,
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </div>
        </div>

        <h2 style={{ margin: 0 }}>Welcome, {user.name}!</h2>
        <p style={{ margin: 0, color: "#94a3b8" }}>{user.email}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          🕐 Logged in at: {loginTime}
        </p>

        <button className="primary-btn" onClick={openModal} style={{ marginTop: 4 }}>
          Edit Profile
        </button>

        <button
          className="primary-btn"
          onClick={handleLogout}
          style={{ marginTop: 4, background: "#475569" }}
        >
          Logout
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#1e293b", borderRadius: 16,
            padding: "2rem", width: 380,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            maxHeight: "90vh", overflowY: "auto",
          }}>

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: "1.5rem", gap: 8 }}>
              {["profile", "password"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "8px",
                    borderRadius: 8, border: "none",
                    cursor: "pointer", fontWeight: "bold",
                    background: activeTab === tab ? "#3b82f6" : "#334155",
                    color: "white",
                  }}
                >
                  {tab === "profile" ? "Edit Profile" : "Change Password"}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Full Name"
                />

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Email"
                />

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.startsWith("+63")) return;
                    setProfileForm({ ...profileForm, phone: val });
                  }}
                  placeholder="+639123456789"
                />

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Profile Picture</label>

                {/* Preview */}
                {profileForm.picture && (
                  <img
                    src={profileForm.picture}
                    alt="Preview"
                    style={{
                      width: 60, height: 60, borderRadius: "50%",
                      objectFit: "cover", margin: "0 auto",
                    }}
                  />
                )}

                {/* File Upload Button */}
                <label style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "10px", borderRadius: 8,
                  background: "#334155", color: "white",
                  cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem",
                }}>
                  <FontAwesomeIcon icon={faUpload} />
                  {profileForm.picture ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </label>

                {profileForm.picture && (
                  <button
                    onClick={() => setProfileForm({ ...profileForm, picture: "" })}
                    style={{
                      background: "none", border: "none",
                      color: "#f87171", cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Remove photo
                  </button>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="primary-btn" onClick={handleProfileSave}>
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1, padding: 12, borderRadius: 8,
                      border: "none", cursor: "pointer",
                      background: "#334155", color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordTouched(true);
                  }}
                />

                {passwordTouched && (
                  <ul className="password-rules" style={{ margin: 0 }}>
                    {passwordRules.map((rule, i) => {
                      const passed = rule.test(newPassword);
                      return (
                        <li key={i} className={passed ? "rule-pass" : "rule-fail"}>
                          <FontAwesomeIcon icon={passed ? faCheck : faXmark} />
                          {" "}{rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {confirmPassword.length > 0 && (
                  <p
                    className={passwordsMatch ? "rule-pass" : "rule-fail"}
                    style={{ fontSize: "0.82rem", textAlign: "left", margin: 0 }}
                  >
                    <FontAwesomeIcon icon={passwordsMatch ? faCheck : faXmark} />
                    {" "}{passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="primary-btn" onClick={handlePasswordSave}>
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1, padding: 12, borderRadius: 8,
                      border: "none", cursor: "pointer",
                      background: "#334155", color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;