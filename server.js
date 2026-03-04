const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");


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

// Logging
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// ==================== CORS ====================
// Telefonlarda ham ishlashi uchun to‘liq ruxsat
app.use(cors({
  origin: "*", // Har qanday telefon/host
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Preflight OPTIONS request
app.options("*", cors());

// ==================== Rate Limiting ====================
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

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== Routes ====================
// Agar /api/auth da login bo‘lsa authLimiter ishlaydi
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));


// Bu route-lar token bilan ishlashi uchun, frontend har doim
// axios headers: { Authorization: `Bearer TOKEN` } yuborishi kerak
app.use("/api/teachers", require("./routes/teacherRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/sections", require("./routes/sectionRoutes"));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Tech College API running..." });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for all origins (telefonlarda ham ishlaydi)`);
});
