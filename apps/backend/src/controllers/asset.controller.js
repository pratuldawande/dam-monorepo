const assetService = require("../services/asset.service");

const list = async (_req, res, next) => {
  try {
    const response = await assetService.listAssets();
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const upload = async (req, res, next) => {
  try {
    const files = req.files || [];

    const uploads = await Promise.all(
      files.map((file) => assetService.uploadAsset(file))
    );

    res.json({
      success: true,
      message: "Assets uploaded successfully",
      data: uploads,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  upload,
};
