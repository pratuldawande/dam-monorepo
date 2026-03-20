const { body } = require("express-validator");
const { MAX_FILE_SIZE_BYTES } = require("../config/env");

exports.assetUploadValidator = [
  body("_assetUpload").custom((_, { req }) => {
    const files = req.files || [];

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("At least one file is required");
    }
    files.forEach((file) => {
      if (!file.originalname) {
        throw new Error("Each uploaded file must have an original name");
      }

      if (!file.mimetype) {
        throw new Error("Each uploaded file must include a MIME type");
      }

      if (!Number.isFinite(file.size) || file.size <= 0) {
        throw new Error("Each uploaded file must have a valid size");
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("Uploaded file exceeds the configured size limit");
      }
    });

    return true;
  }),
];
