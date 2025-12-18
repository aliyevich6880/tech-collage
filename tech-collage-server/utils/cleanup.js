const fs = require("fs");
const path = require("path");
const { deleteFileSync } = require("./helpers");

/**
 * Cleanup old files from uploads directory
 * Deletes files older than specified age (default: 1 hour)
 * @param {number} maxAgeMs - Maximum age in milliseconds (default: 1 hour)
 * @returns {number} Number of files deleted
 */
const cleanupOldFiles = (maxAgeMs = 60 * 60 * 1000) => {
  const uploadsDir = path.join(__dirname, "..", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    return 0;
  }

  const files = fs.readdirSync(uploadsDir);
  const now = Date.now();
  let deletedCount = 0;

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    
    try {
      const stats = fs.statSync(filePath);
      
      // Skip if it's a directory
      if (stats.isDirectory()) {
        continue;
      }

      const age = now - stats.mtimeMs;

      if (age > maxAgeMs) {
        deleteFileSync(filePath);
        deletedCount++;
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
    }
  }

  if (deletedCount > 0) {
    console.log(`Cleanup: Deleted ${deletedCount} old file(s) from uploads directory`);
  }

  return deletedCount;
};

/**
 * Initialize cleanup job
 * Runs cleanup immediately and then every 30 minutes
 */
const initCleanupJob = () => {
  const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
  const MAX_FILE_AGE = 60 * 60 * 1000; // 1 hour

  // Run cleanup immediately on startup
  console.log("Initializing file cleanup job...");
  cleanupOldFiles(MAX_FILE_AGE);

  // Schedule periodic cleanup
  setInterval(() => {
    cleanupOldFiles(MAX_FILE_AGE);
  }, CLEANUP_INTERVAL);

  console.log(`Cleanup job initialized: will run every ${CLEANUP_INTERVAL / 1000 / 60} minutes`);
};

module.exports = {
  cleanupOldFiles,
  initCleanupJob,
};

