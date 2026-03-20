const express = require("express");
const assetController = require("../controllers/asset.controller");
const { validate } = require("../middlewares/validate.middleware");
const upload = require("../utils/upload");
const { assetUploadValidator } = require("../validators/asset.validator");

const router = express.Router();

router.get("/", assetController.list);
router.post(
  "/upload",
  upload.array("files"),
  assetUploadValidator,
  validate,
  assetController.upload,
);

module.exports = router;
