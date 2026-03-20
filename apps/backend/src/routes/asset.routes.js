const express = require("express");
const assetController = require("../controllers/asset.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const upload = require("../utils/upload");
const { assetUploadValidator } = require("../validators/asset.validator");

const router = express.Router();
router.use(authMiddleware);
router.get("/", assetController.list);
router.post(
  "/upload",
  upload.array("files"),
  assetUploadValidator,
  validate,
  assetController.upload,
);

module.exports = router;
