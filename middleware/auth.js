const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");

// JWT settings
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Validate required environment variables in production
if (process.env.NODE_ENV === "production") {
  if (!JWT_SECRET || JWT_SECRET === "dev_jwt_secret_change_me") {
    console.error("ERROR: JWT_SECRET must be set in production!");
    process.exit(1);
  }
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error("ERROR: ADMIN_USERNAME and ADMIN_PASSWORD must be set in production!");
    process.exit(1);
  }
}

// Admin login: username/password is checked and JWT is returned
const loginAdmin = (username, password) => {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";
  
  // In production, require environment variables
  if (process.env.NODE_ENV === "production") {
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error("Admin credentials not configured!");
      return null;
    }
  }

  if (username !== adminUsername || password !== adminPassword) {
    return null;
  }

  const payload = {
    username,
    role: "admin",
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return token;
};

// Logout: add token to MongoDB blacklist
const logoutAdmin = async (token) => {
  if (!token) return false;

  try {
    // Token expire vaqtini olish
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return false;
    }

    const expiresAt = new Date(decoded.exp * 1000);

    // Token allaqachon blacklistda bo'lsa ham, muvaffaqiyatli deb qaytaramiz
    await BlacklistToken.findOneAndUpdate(
      { token },
      { token, expiresAt },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error("Error adding token to blacklist:", error);
    return false;
  }
};

// Middleware: verify JWT and allow only admin user
const requireAdminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  // MongoDB blacklistdan tekshirish
  try {
    const blacklistedToken = await BlacklistToken.findOne({ token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "Token invalidated, please login again" });
    }
  } catch (error) {
    console.error("Error checking blacklist:", error);
    // Xatolik bo'lsa ham davom etamiz (fallback)
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: "Token data not found" });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({ 
        message: "No permission for admin", 
        receivedRole: decoded.role,
      });
    }

    // May be useful for next middleware/controllers
    req.admin = decoded;

    return next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ 
      message: "Invalid or expired token",
      error: err.message 
    });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  requireAdminAuth,
};


