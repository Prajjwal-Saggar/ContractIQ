const Document = require("../models/document.model");
const { uploadFile } = require("./cloudinaryService");
const AppError = require("../utils/appError");

const uploadDocService = async ({ userId, file }) => {
  if (!file) {
    throw new AppError("File object is missing or undefined", 400);
  }
  const document = await Document.create({
    userId: userId,
    filename: file.originalname,
    fileUrl: "PENDING",
    filePublicId: "PENDING",
    status: "UPLOADING",
  });
  try {
    const result = await uploadFile(file.buffer);
    document.fileUrl = result.secure_url;
    document.filePublicId = result.public_id;
    document.status = "PROCESSING";

    await document.save();
    return document;
  } catch (error) {
    document.status = "FAILED";
    await document.save();
    throw new AppError("Document upload failed. Please try again.", 500, error);
  }
};

const docGetService = async (userId) => {
  try {
    const documents = await Document.find({userId});
    return documents;
  } catch (error) {
    throw new AppError("Error Fetching Documents", 500, error);
  }
};

module.exports = { uploadDocService, docGetService };
