const fs = require("fs");
const imagekit = require("../config/imagekit");
const Teacher = require("../models/Teacher");
const { deleteFile } = require("../utils/helpers");

// GET /api/teachers
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

// POST /api/teachers
const createTeacher = async (req, res, next) => {
  let fileToDelete = null;

  try {
    const { fullName, subject } = req.body;

    if (!fullName || !subject) {
      return res
        .status(400)
        .json({ message: "fullName and subject fields are required" });
    }

    // Check if teacher with same fullName and subject exists
    const existingTeacher = await Teacher.findOne({ fullName, subject });
    if (existingTeacher) {
      return res.status(409).json({
        message: `Teacher with this fullName (${fullName}) and subject (${subject}) combination already exists`,
      });
    }

    let teacherImg;

    if (req.file) {
      fileToDelete = req.file.path; // Save file path for cleanup

      try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.filename,
          folder: "/tech-collage/teachers",
        });

        teacherImg = uploadResponse.url;
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    const teacher = await Teacher.create({
      fullName,
      subject,
      teacherImg,
    });

    res.status(201).json(teacher);
  } catch (error) {
    // Error will be handled by global error handler
    next(error);
  } finally {
    // Always delete file in finally block to ensure cleanup
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
  }
};

// GET /api/teachers/:id
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

// PUT /api/teachers/:id
const updateTeacher = async (req, res, next) => {
  let fileToDelete = null;

  try {
    const { fullName, subject } = req.body;

    // Find current teacher
    const currentTeacher = await Teacher.findById(req.params.id);
    if (!currentTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // If fullName or subject is being updated, check for duplicates
    if (fullName || subject) {
      const checkFullName = fullName || currentTeacher.fullName;
      const checkSubject = subject || currentTeacher.subject;

      // Check for duplicate with other teachers (excluding current teacher)
      const existingTeacher = await Teacher.findOne({
        fullName: checkFullName,
        subject: checkSubject,
        _id: { $ne: req.params.id },
      });

      if (existingTeacher) {
        return res.status(409).json({
          message: `Teacher with this fullName (${checkFullName}) and subject (${checkSubject}) combination already exists`,
        });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (subject) updateData.subject = subject;

    if (req.file) {
      fileToDelete = req.file.path; // Save file path for cleanup

      try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.filename,
          folder: "/tech-collage/teachers",
        });

        updateData.teacherImg = uploadResponse.url;
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    // If updateData is empty (only image is being updated), return current teacher
    let teacher;
    if (Object.keys(updateData).length > 0) {
      teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
    } else {
      teacher = currentTeacher;
    }

    res.json(teacher);
  } catch (error) {
    next(error);
  } finally {
    // Always delete file in finally block to ensure cleanup
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
  }
};

// DELETE /api/teachers/:id
const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};


