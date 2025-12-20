const express = require("express");
const {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const { uploadSingleImage } = require("../middleware/upload");
const { requireAdminAuth } = require("../middleware/auth");

const router = express.Router();

// ✅ GET - Hammaga ochiq (token kerak emas)
router.get("/", getTeachers);
router.get("/:id", getTeacherById);

// 🔒 POST/PUT/DELETE - Faqat admin (token kerak)
router.post(
  "/",
  requireAdminAuth,
  uploadSingleImage("teacherImg"),
  createTeacher
);

router.put(
  "/:id",
  requireAdminAuth,
  uploadSingleImage("teacherImg"),
  updateTeacher
);

router.delete("/:id", requireAdminAuth, deleteTeacher);

module.exports = router;