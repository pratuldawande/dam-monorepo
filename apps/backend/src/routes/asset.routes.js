const express = require("express");
const assetController = require("../controllers/asset.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const upload = require("../utils/upload");
const {
  assetListValidator,
  assetUploadValidator,
} = require("../validators/asset.validator");

const router = express.Router();
router.use(authMiddleware);
router.get("/", assetListValidator, validate, assetController.listAssets);
router.post(
  "/upload",
  upload.array("files"),
  assetUploadValidator,
  validate,
  assetController.uploadAssets
);
router.delete("/:assetId", assetController.deleteAsset);

module.exports = router;
