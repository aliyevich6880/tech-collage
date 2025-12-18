const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

/**
 * Safely delete a file asynchronously
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  if (!filePath) return;

  try {
    // Check if file exists
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
      console.log(`File deleted successfully: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error.message);
    // Don't throw error - just log it to prevent breaking the flow
  }
};

/**
 * Safely delete a file synchronously (for cleanup jobs)
 * @param {string} filePath - Path to the file to delete
 */
const deleteFileSync = (filePath) => {
  if (!filePath) return;

  try {
    if (fsSync.existsSync(filePath)) {
      fsSync.unlinkSync(filePath);
      console.log(`File deleted successfully: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error.message);
  }
};

module.exports = {
  deleteFile,
  deleteFileSync,
};

