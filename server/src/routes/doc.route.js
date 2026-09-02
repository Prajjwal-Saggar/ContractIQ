const express = require("express");
const {
  docUploadController,
  docGetController,
} = require("../controllers/docController");
const multer = require("multer");
const docRouter = express.Router();
const storage = multer.memoryStorage();
const AppError = require("../utils/appError");

const {protect}   = require("../middlewares/protectMiddleware")

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF allowed."), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15000000,
    files: 1,
  },
  fileFilter: fileFilter,
});

const handleUpload = (req, res, next) => {
  upload.single("document")(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    next();
  });
};

docRouter.post("/upload",protect, handleUpload, docUploadController);
docRouter.get("/",protect, docGetController);

module.exports = docRouter;
