const fs = require("fs");
const imagekit = require("../config/imagekit");
const News = require("../models/News");
const { deleteFile } = require("../utils/helpers");

// GET /api/news
const getNews = async (req, res, next) => {
  try {
    const newsList = await News.find().sort({ publishedAt: -1 });
    res.json(newsList);
  } catch (error) {
    next(error);
  }
};

// POST /api/news
const createNews = async (req, res, next) => {
  let fileToDelete = null;

  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description fields are required" });
    }

    let img;

    if (req.file) {
      fileToDelete = req.file.path; // Save file path for cleanup

      try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.filename,
          folder: "/tech-collage/news",
        });

        img = uploadResponse.url;
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    const news = await News.create({
      title,
      description,
      img,
    });

    res.status(201).json(news);
  } catch (error) {
    next(error);
  } finally {
    // Always delete file in finally block to ensure cleanup
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
  }
};

// GET /api/news/:id
const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    next(error);
  }
};

// PUT /api/news/:id
const updateNews = async (req, res, next) => {
  let fileToDelete = null;

  try {
    const { title, description } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (req.file) {
      fileToDelete = req.file.path; // Save file path for cleanup

      try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const uploadResponse = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.filename,
          folder: "/tech-collage/news",
        });

        updateData.img = uploadResponse.url;
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    next(error);
  } finally {
    // Always delete file in finally block to ensure cleanup
    if (fileToDelete) {
      await deleteFile(fileToDelete);
    }
  }
};

// DELETE /api/news/:id
const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
};


