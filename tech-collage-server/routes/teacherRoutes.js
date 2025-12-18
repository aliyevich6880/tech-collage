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

// All teachers - admin only
router.get("/", requireAdminAuth, getTeachers);

// Single teacher - admin only
router.get("/:id", requireAdminAuth, getTeacherById);

// New teacher (with image) - admin only
router.post(
  "/",
  requireAdminAuth,
  uploadSingleImage("teacherImg"),
  createTeacher
);

// Update teacher (image optional) - admin only
router.put(
  "/:id",
  requireAdminAuth,
  uploadSingleImage("teacherImg"),
  updateTeacher
);

// Delete teacher - admin only
router.delete("/:id", requireAdminAuth, deleteTeacher);

module.exports = router;


