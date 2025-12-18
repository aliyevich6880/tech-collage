const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    teacherImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate fullName and subject combinations
teacherSchema.index({ fullName: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Teacher", teacherSchema);


