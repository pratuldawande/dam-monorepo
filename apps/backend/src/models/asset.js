const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  filename: String,
  url: String,
  type: String,
  size: Number,
  tags: [String],
  metadata: Object,
  status: {
    type: String,
    enum: ["uploaded", "processing", "completed"],
    default: "uploaded",
  },
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);