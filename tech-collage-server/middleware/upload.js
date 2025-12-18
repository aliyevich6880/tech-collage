const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed image file types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// File filter function
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
      ),
      false
    );
  }
};

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

// Initialize uploads directory
ensureUploadsDir();

// Temporarily save files to local folder (for uploading to ImageKit later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, "uploads/"); // Create uploads/ folder in project
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware for single image
const uploadSingleImage = (fieldName) => upload.single(fieldName);

module.exports = {
  uploadSingleImage,
};



