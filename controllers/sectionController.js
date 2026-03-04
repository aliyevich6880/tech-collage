const Section = require("../models/Section");

// GET /api/sections
const getSections = async (req, res, next) => {
  try {
    const sections = await Section.find().sort({ createdAt: -1 });
    res.json(sections);
  } catch (error) {
    next(error);
  }
};

// GET /api/sections/:id
const getSectionById = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.json(section);
  } catch (error) {
    next(error);
  }
};

// POST /api/sections
const createSection = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const groups = Array.isArray(req.body.groups)
      ? req.body.groups.map((g) => String(g || "").trim()).filter(Boolean)
      : [];

    if (!name) {
      return res.status(400).json({ message: "name field is required" });
    }

    if (groups.length === 0) {
      return res.status(400).json({ message: "groups field is required" });
    }

    const section = await Section.create({
      name,
      groups,
    });

    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
};

// PUT /api/sections/:id
const updateSection = async (req, res, next) => {
  try {
    const updateData = {};

    if (typeof req.body.name !== "undefined") {
      const name = String(req.body.name || "").trim();
      if (!name) {
        return res.status(400).json({ message: "name field is required" });
      }
      updateData.name = name;
    }

    if (typeof req.body.groups !== "undefined") {
      if (!Array.isArray(req.body.groups)) {
        return res.status(400).json({ message: "groups must be an array" });
      }
      const groups = req.body.groups
        .map((g) => String(g || "").trim())
        .filter(Boolean);

      if (groups.length === 0) {
        return res.status(400).json({ message: "groups cannot be empty" });
      }
      updateData.groups = groups;
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(section);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/sections/:id
const deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.json({ message: "Section deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
};

