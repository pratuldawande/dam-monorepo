const express = require("express");
const multer = require("multer");
// const assetController = require("../controllers/asset.controller");
const assetController = require("../controllers/asset.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("files"), assetController.upload);

module.exports = router;