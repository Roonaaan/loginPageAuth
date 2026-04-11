const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const pool = require("./db");
require("dotenv").config();

const findOrCreate = async (email, name, provider, providerId, picture) => {
  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (existing.rows.length > 0) {
    const updated = await pool.query(
      "UPDATE users SET picture = $1 WHERE email = $2 RETURNING *",
      [picture, email]
    );
    return updated.rows[0];
  }

  const result = await pool.query(
    "INSERT INTO users (name, email, provider, provider_id, picture) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, provider, providerId, picture]
  );
  return result.rows[0];
};

// Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const picture = profile.photos?.[0]?.value || null;
    const user = await findOrCreate(email, profile.displayName, "google", profile.id, picture);
    done(null, user);
  } catch (err) { done(err); }
}));

// GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback",
  scope: ["user:email"],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
    const picture = profile.photos?.[0]?.value || null;
    const user = await findOrCreate(email, profile.displayName || profile.username, "github", profile.id, picture);
    done(null, user);
  } catch (err) { done(err); }
}));