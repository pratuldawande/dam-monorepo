const assetService = require("../services/asset.service");

const upload = async (req, res, next) => {
  try {
    const files = req.files;

    const uploads = await Promise.all(
      files.map(file => assetService.uploadAsset(file))
    );

    res.json({
      success: true,
      data: uploads,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload
};