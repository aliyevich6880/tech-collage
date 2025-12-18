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

// All news - admin only
router.get("/", requireAdminAuth, getNews);

// Single news - admin only
router.get("/:id", requireAdminAuth, getNewsById);

// New news (with image) - admin only
router.post(
  "/",
  requireAdminAuth,
  uploadSingleImage("img"),
  createNews
);

// Update news (image optional) - admin only
router.put(
  "/:id",
  requireAdminAuth,
  uploadSingleImage("img"),
  updateNews
);

// Delete news - admin only
router.delete("/:id", requireAdminAuth, deleteNews);

module.exports = router;


