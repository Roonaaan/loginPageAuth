const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, forgotPassword, verifyCode, resetPassword, updateProfile, updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
require("../config/passport");

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

const oauthCallback = (req, res) => {
  const token = generateToken(req.user);
  const user = encodeURIComponent(JSON.stringify({
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  }));
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&user=${user}`);
};

// Local Auth
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

// Protected
router.get("/me", protect, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, picture, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  oauthCallback
);

// GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  oauthCallback
);

module.exports = router;