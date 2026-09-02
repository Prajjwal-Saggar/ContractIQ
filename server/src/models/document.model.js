const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    filename: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPLOADING", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADING",
    },
    pageCount:{
      type:Number
    }
  },
  { timestamps: true },
);

const Document = mongoose.model("document", documentSchema);

module.exports = Document;
