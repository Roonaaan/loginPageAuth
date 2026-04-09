const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const pool = require("./db");
require("dotenv").config();

const findOrCreate = async (email, name, provider, providerId, picture) => {
  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
  if (existing.rows.length > 0) {
    // Update picture and RETURN the updated row
    const updated = await pool.query(
      "UPDATE users SET picture = $1 WHERE email = $2 RETURNING *",
      [picture, email]
    );
    return updated.rows[0]; // ✅ returns updated user with picture
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

// Microsoft
passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: "/api/auth/microsoft/callback",
  scope: ["user.read"],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const picture = profile.photos?.[0]?.value || null;
    const user = await findOrCreate(email, profile.displayName, "microsoft", profile.id, picture);
    done(null, user);
  } catch (err) { done(err); }
}));

// Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ["id", "emails", "displayName", "photos"],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const picture = profile.photos?.[0]?.value || null;
    const user = await findOrCreate(email, profile.displayName, "facebook", profile.id, picture);
    done(null, user);
  } catch (err) { done(err); }
}));