const { loginAdmin, logoutAdmin } = require("../middleware/auth");

// POST /api/auth/login
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const token = loginAdmin(username, password);

  if (!token) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.json({ message: "Login successful", token });
};

// POST /api/auth/logout
const logout = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }

  try {
    const ok = await logoutAdmin(token);
    if (!ok) {
      return res.status(400).json({ message: "Token already invalidated or invalid" });
    }

    return res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};

module.exports = {
  login,
  logout,
};


