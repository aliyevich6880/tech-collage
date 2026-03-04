const express = require("express");
const {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const { requireAdminAuth } = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", getSections);
router.get("/:id", getSectionById);

// Admin
router.post("/", requireAdminAuth, createSection);
router.put("/:id", requireAdminAuth, updateSection);
router.delete("/:id", requireAdminAuth, deleteSection);

module.exports = router;

