const { uploadDocService, docGetService } = require("../services/docService");

const docUploadController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a PDF file." });
    }
    const userId = req.userId;

    const savedDoc = await uploadDocService({ userId, file: req.file });
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: savedDoc,
    });
  } catch (error) {
    next(error);
  }
};

const docGetController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const docs = await docGetService(userId);
    if (docs.length === 0) {
      return res.status(200).json({ message: "No Documents Available" }, []);
    }
    return res.status(200).json({ docs });
  } catch (error) {
    next(error);
  }
};

module.exports = { docUploadController, docGetController };
