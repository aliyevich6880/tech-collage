const express = require("express");
const {
  getNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { uploadSingleImage } = require("../middleware/upload");
const { requireAdminAuth } = require("../middleware/auth");

const router = express.Router();

// ✅ GET - Hammaga ochiq (token kerak emas)
router.get("/", getNews);
router.get("/:id", getNewsById);

// 🔒 POST/PUT/DELETE - Faqat admin (token kerak)
router.post(
  "/",
  requireAdminAuth,
  uploadSingleImage("img"),
  createNews
);

router.put(
  "/:id",
  requireAdminAuth,
  uploadSingleImage("img"),
  updateNews
);

router.delete("/:id", requireAdminAuth, deleteNews);

module.exports = router;