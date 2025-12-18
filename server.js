const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { initCleanupJob } = require("./utils/cleanup");

dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();
initCleanupJob();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ==================== CORS - MANUAL ====================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
// ======================================================

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Tech College API running..." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;  // 5001 ekanligini tekshiring

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 CORS enabled for all origins`);
});